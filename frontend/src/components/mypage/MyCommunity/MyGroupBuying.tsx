import React, {useState, useEffect} from 'react';
import "../../../style/_myGroupBuying.scss"
import RequestedModal from '../../modal/GroupBuyingRequestedModal.tsx';
import CloseModal from '../../modal/_CloseModal.tsx'
import ExitModal from '../../modal/_ExitModal.tsx'

import axios, {AxiosResponse, AxiosError} from 'axios';
import { useSelector } from 'react-redux';

import RootState from "../../../reducer/reducers.tsx"
import {reversedatetrans} from '../../../actions/_TimeLapse.tsx'

import { groupbuyingtype } from "../../actions/_interfaces.tsx";

function MyGroupBuying() {
    const user = useSelector((state:RootState) =>{
        return state.accounts.data.user
    })
    const [ myGroupBuyingList, setMyGroupBuyingList ] = useState<groupbuyingtype[]>([]);
    const [ modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [ closeModalOpen, setCloseModalOpen] = React.useState<boolean>(false);
    const [ exitModalOpen, setExitModalOpen] = React.useState<boolean>(false);
    const [ modalPropsData, setModalPropsData] = React.useState<groupbuyingtype>(null);

    const openModal = (data:groupbuyingtype) => {
        setModalOpen(true);
        setModalPropsData(data);
    };
    const closeModal = () => {
        setModalOpen(false);
    };

    const openCloseModal = (data:groupbuyingtype) => {
        setModalPropsData(data);
        setCloseModalOpen(true);
    }
    const closeCloseModal = () => {
        setCloseModalOpen(false);
    }

    const closeExitModal = () => {
        setExitModalOpen(false);
    }

    const handleDelCommunity = (myCommunityId:number) =>{
        axios.delete(`/board-service/group-purchase`,{data:{id:myCommunityId}})
        .then((response:AxiosResponse) => {
            handlegetMyList()
        })
        .catch((error:AxiosError) => {
            alert("오류입니다 관리자와 이야기 해주세요!")
        })
    }

    const handlegetMyList = () => {
        axios.get(`/board-service/group-purchase/${user.id}`)
            .then((response:AxiosResponse) => {
            setMyGroupBuyingList(response.data.content)
            })
    };

    useEffect(()=>{
        handlegetMyList();
    },[])


    const handleFinish = (data:any) => {
        const deldata = {
            data: {
                closeTime: data.closeTime,
                id: data.id,
                pickupLocation: data.pickupLocation,
                price: data.price,
                productName: data.productName,
                url: data.url,
                userId: user.id
            }
        }
        axios.delete('/board-service/group-purchase',deldata
        ).then((res)=>{
            handlegetMyList();
        }).catch((err)=>{
            alert("오류입니다 관리자와 이야기 해주세요!")
        })
    };

    return (
        <div>
            <div className='myGroupBuyingInList'>
                {myGroupBuyingList.map((mgdata:groupbuyingtype) =>(
                    <div className='shadow' key={mgdata.id}>
                        <div>{mgdata.productName}</div>
                        {reversedatetrans(mgdata.closeTime)==="종료되었습니다." ?(
                        <div>종료되었습니다.</div>
                        ):(
                        <div>{reversedatetrans(mgdata.closeTime)}남았습니다.</div>
                        )}
                        <div className='myGroupCardTwoBtn'>
                            {reversedatetrans(mgdata.closeTime)==="종료되었습니다." ?(
                            <div onClick={()=>{openCloseModal(mgdata)}}>톡만들기</div>
                            ):(
                            <div onClick={()=>{openCloseModal(mgdata)}}>마감하기</div>
                            )}
                            <div onClick={()=>{openModal(mgdata)}}>신청내역확인</div>
                        </div> 
                    </div>
                ))}
            </div>
            <div>
                <CloseModal open={closeModalOpen}  close={closeCloseModal} info={modalPropsData} finish={handleFinish}>
                </CloseModal>
            </div>
            <div>
                <RequestedModal open={modalOpen}  close={closeModal} info={modalPropsData}>
                </RequestedModal>
            </div>
            <div>
                <ExitModal open={exitModalOpen}  close={closeExitModal} info={modalPropsData} finish={handleDelCommunity}>
                </ExitModal>
            </div>
        </div>
    );
}

export default MyGroupBuying;