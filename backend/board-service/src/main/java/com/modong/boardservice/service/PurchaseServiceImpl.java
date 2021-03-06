package com.modong.boardservice.service;

import com.modong.boardservice.db.entity.Purchase;
import com.modong.boardservice.db.repository.PurchaseRepository;
import com.modong.boardservice.db.repository.PurchaseRepositoryImpl;
import com.modong.boardservice.messagequeue.KafkaProducer;
import com.modong.boardservice.request.PurchaseReqDTO;
import com.modong.boardservice.response.PurchaseResDTO;
import com.modong.boardservice.response.UserResDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseService{

    @Autowired
    PurchaseRepository purchaseRepository;

    @Autowired
    PurchaseRepositoryImpl purchaseRepositoryImpl;

    @Autowired
    UserClientService userClientService;

    @Autowired
    KafkaProducer kafkaProducer;

    @Override
    public void createPurchase(PurchaseReqDTO purchaseReqDTO) {
        Long dongCode = Long.valueOf(userClientService.getUser(purchaseReqDTO.getUserId()).getDongDto().get("dongcode"));

        Purchase purchase = Purchase.builder()
                .closeTime(purchaseReqDTO.getCloseTime())
                .price(purchaseReqDTO.getPrice())
                .chatOpen(false)
                .productName(purchaseReqDTO.getProductName())
                .pickupLocation(purchaseReqDTO.getPickupLocation())
                .url(purchaseReqDTO.getUrl())
                .userId(purchaseReqDTO.getUserId())
                .dongCode(dongCode)
                .build();

        purchaseRepository.save(purchase);
    }

    @Override
    public void deletePurchase(Long id) {
        Purchase purchase = purchaseRepository.getById(id);

        purchase.setCloseTime(LocalDateTime.now());
        purchase.setChatOpen(true);
        kafkaProducer.send("order-topic" , purchase.getId() ,"ORDER_GROUP" , purchase.getProductName() , Long.toString(purchase.getUserId()));
        purchaseRepository.save(purchase);
    }


    @Override
    public Page<PurchaseResDTO> purchaseListCalling(Pageable pageable, Long userId) {
        Long dongCode = Long.valueOf(userClientService.getUser(userId).getDongDto().get("dongcode"));

        Page<Purchase> purchases = purchaseRepositoryImpl.findAllByTimeLimit(pageable,dongCode);

        List<PurchaseResDTO> purchaseList = new ArrayList<>();

        for(Purchase p : purchases.getContent()){

            UserResDTO user = userClientService.getUser(p.getUserId());
            PurchaseResDTO dto = PurchaseResDTO.builder()
                    .closeTime(p.getCloseTime())
                    .id(p.getId())
                    .pickupLocation(p.getPickupLocation())
                    .price(p.getPrice())
                    .productName(p.getProductName())
                    .url(p.getUrl())
                    .userInfo(user)
                    .build();

            purchaseList.add(dto);
        }

        return new PageImpl<>(purchaseList, pageable, purchases.getTotalElements());
    }

    @Override
    public Page<PurchaseResDTO> myPurchaseListCalling(Pageable pageable, Long userId) {
        Page<Purchase> purchases = purchaseRepositoryImpl.findAllByTimeLimitAndByUserId(pageable,userId);
        UserResDTO user = userClientService.getUser(userId);

        List<PurchaseResDTO> purchaseList = new ArrayList<>();

        for(Purchase p : purchases.getContent()){

            PurchaseResDTO dto = PurchaseResDTO.builder()
                    .closeTime(p.getCloseTime())
                    .id(p.getId())
                    .pickupLocation(p.getPickupLocation())
                    .price(p.getPrice())
                    .chatOpen(p.getChatOpen())
                    .productName(p.getProductName())
                    .url(p.getUrl())
                    .userInfo(user)
                    .build();

            purchaseList.add(dto);
        }

        return new PageImpl<>(purchaseList, pageable, purchases.getTotalElements());
    }

    @Override
    public PurchaseResDTO getPurchaseOne(Long id) {
        Purchase purchase =  purchaseRepository.getById(id);
        PurchaseResDTO purchaseResDTO = PurchaseResDTO.builder()
                .id(purchase.getId())
                .url(purchase.getUrl())
                .productName(purchase.getProductName())
                .price(purchase.getPrice())
                .pickupLocation(purchase.getPickupLocation())
                .closeTime(purchase.getCloseTime())
                .build();

        return purchaseResDTO;
    }
}
