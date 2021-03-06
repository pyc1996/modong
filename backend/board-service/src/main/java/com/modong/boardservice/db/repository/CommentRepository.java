package com.modong.boardservice.db.repository;

import com.modong.boardservice.db.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CommentRepository extends JpaRepository<Comment, Long > {

    Page<Comment> findAllByDeletedIsFalseAndBoard_Id(Long id, Pageable pageable);

}
