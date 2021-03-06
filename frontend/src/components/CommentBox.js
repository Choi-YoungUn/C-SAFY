/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { defaultAPI } from '../utils/api';
// Recoil
import { useRecoilState } from 'recoil';
import { LoginState } from '../recoils/LoginState';
import { Token } from '../recoils/Token';

// STYLED
import styled from 'styled-components';
import swal from 'sweetalert2';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';

const Box = styled.div`
  // width: 740px;
  width: 100%;
  height: 140px;
  border-radius: 9px;
  box-shadow: 0 0 11px 1px rgba(0, 0, 0, 0.12);
  background-color: #fff;

  margin-bottom: 20px;

  position: relative;
`;
const UserInfo = styled.div`
  font-size: 20px;
  position: absolute;
  top: 10px;
  left: 25px;
`;
const DateInfo = styled.div`
  color: grey;
  position: absolute;
  top: 33px;
  left: 25px;
`;
const Comment = styled.div`
  width: 580px;
  height: 55px;
  // border: 1px solid black;
  border-right: 10px solid rgba(0, 0, 0, 0.1);
  border-bottom: 10px solid lightgrey;

  padding-top: 10px;
  padding-left: 10px;

  position: absolute;
  bottom: 10px;
  left: 25px;
`;
const CommentInput = styled.input`
  width: 580px;
  height: 55px;
  font-size: 16px;
  // border: 1px solid black;
  border: none;
  border-right: 10px solid rgba(0, 0, 0, 0.1);
  border-bottom: 10px solid lightgrey;

  position: absolute;
  bottom: 10px;
  left: 25px;
`;
const ButtonBox = styled.div`
  width: 60px;
  height: 119px;
  border-radius: 9px;
  // box-shadow: 0 0 11px 1px rgba(0, 142, 208, 0.12);
  // background-color: rgba(0, 142, 208, 0.1);
  // background-color: rgba(0, 0, 0, 0.1);

  position: absolute;
  top: 10px;
  right: 15px;
`;

function CommentBox({
  id,
  comment,
  interviewSeq,
  createdAt,
  liked,
  likesCount,
  username,
  getComment,
}) {
  // Recoil
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);
  const [token, setToken] = useRecoilState(Token);

  // ?????? ??????
  const [commentInfo, setCommentInfo] = useState({});
  const getCommentData = () => {
    axios
      .get(`${defaultAPI}/cs-service/interview/${id}/comment/info`, {
        headers: { Authorization: token },
      })
      .then(res => {
        // console.log(res);
        setCommentInfo(res.data);
      })
      .catch(err => console.error(err));
  };
  useEffect(() => {
    getCommentData();
  }, []);

  const handleLike = () => {
    setCommentLikeData();
  };

  // ????????? ?????? ??????
  const setCommentLikeData = () => {
    axios
      .post(`${defaultAPI}/cs-service/interview/${id}/comment/likes`, null, {
        headers: { Authorization: token },
      })
      .then(res => {
        // console.log(res);
        getCommentData();
      })
      .catch(err => console.error(err));
  };

  // ?????? ?????? ??????
  const [editToggle, setEditToggle] = useState(false);
  const [newComment, setNewComment] = useState(comment);

  const toggleComment = () => {
    editComment();
    // setEditToggle(!editToggle);
    // ????????? put, ????????? delete - interview/{commentId}/comment
    // if (editToggle) {
    //   editComment();
    // }
  };
  const editComment = () => {
    axios
      .put(
        `${defaultAPI}/cs-service/interview/${id}/comment`,
        { comment: newComment },
        { headers: { Authorization: token } },
      )
      .then(res => {
        // console.log(res);
        setNewComment(res.data.comment);
        setEditToggle(!editToggle);
      })
      .catch(err => {
        setNewComment(comment);
        // alert('???????????? ????????? ???????????????.');
        swal.fire({
          icon: 'error',
          position: 'middle',
          title: '???????????? ????????? ???????????????.',

          // showCancelButton: true, // cancel?????? ?????????. ????????? ?????? ??????
          confirmButtonColor: '#3085d6', // confrim ?????? ?????? ??????
          // cancelButtonColor: '#d33', // cancel ?????? ?????? ??????
          confirmButtonText: '??????', // confirm ?????? ????????? ??????
          // cancelButtonText: '??????', // cancel ?????? ????????? ??????
        });
        // .then(result => {
        //   // ?????? Promise????????? ?????????,
        //   if (result.isConfirmed) {
        //     // ?????? ??????????????? confirm ????????? ????????????
        //     setCurrentPage('/');
        //     navigate('/');
        //   }
        // });
        setEditToggle(false);
        // setEditToggle(!editToggle);
      });
  };

  // ??????
  const deleteComment = () => {
    axios
      .delete(`${defaultAPI}/cs-service/interview/${id}/comment`, {
        headers: { Authorization: token },
      })
      .then(res => {
        // console.log(res);
        getComment();
      })
      .catch(err =>
        swal.fire({
          icon: 'error',
          position: 'middle',
          title: '???????????? ????????? ???????????????.',

          // showCancelButton: true, // cancel?????? ?????????. ????????? ?????? ??????
          confirmButtonColor: '#3085d6', // confrim ?????? ?????? ??????
          // cancelButtonColor: '#d33', // cancel ?????? ?????? ??????
          confirmButtonText: '??????', // confirm ?????? ????????? ??????
          // cancelButtonText: '??????', // cancel ?????? ????????? ??????
        }),
      );
  };

  return (
    <div>
      <Box>
        {editToggle ? (
          <>
            <UserInfo>{username}</UserInfo>
            <DateInfo>{createdAt.substr(0, 10)}</DateInfo>
            <CommentInput
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
          </>
        ) : (
          <>
            <UserInfo>{username}</UserInfo>
            <DateInfo>{createdAt.substr(0, 10)}</DateInfo>

            <Comment>{newComment}</Comment>
          </>
        )}

        <ButtonBox>
          {commentInfo.liked ? (
            <div
              style={{
                border: '2px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '5px',
                paddingBottom: '10px',
              }}
            >
              <ThumbUpIcon
                sx={{ width: '100%', mt: '15px', cursor: 'pointer' }}
                onClick={handleLike}
              />
              <p style={{ margin: '0', width: '100%', textAlign: 'center' }}>
                {commentInfo.commentLikesCount}
              </p>
            </div>
          ) : (
            <div
              style={{
                border: '2px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '5px',
                paddingBottom: '10px',
              }}
            >
              <ThumbUpOffAltIcon
                sx={{ width: '100%', mt: '15px', cursor: 'pointer' }}
                onClick={handleLike}
              />
              <p style={{ margin: '0', width: '100%', textAlign: 'center' }}>
                {commentInfo.commentLikesCount}
              </p>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '18px',
            }}
          >
            {editToggle ? (
              <EditIcon
                color="primary"
                sx={{ cursor: 'pointer' }}
                onClick={toggleComment}
              />
            ) : (
              <EditIcon sx={{ cursor: 'pointer' }} onClick={toggleComment} />
            )}
            <ClearIcon sx={{ cursor: 'pointer' }} onClick={deleteComment} />
          </div>
        </ButtonBox>
      </Box>
    </div>
  );
}

export default React.memo(CommentBox);
