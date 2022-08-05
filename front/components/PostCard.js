import React, {useState, useCallback, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types'
import Link from "next/link";
import moment from 'moment';
import { Avatar, Button, Card, Comment, List, Popover } from 'antd';
import { EllipsisOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, RetweetOutlined } from "@ant-design/icons";

import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import FollowButton from "./FollowButton";

import { REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST, retweetError } from "../reducers/post";

moment.locale('ko')

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { me } = useSelector(({ user }) => ({
    me: user.me
  }))
  const { removePostLoading, retweetError } = useSelector(({ post }) => (post))
  const [commentFormOpenned, setCommentFormOpenned] = useState(false);
  const id = me?.id;

  const liked = post.Likers.find((liker) => liker.id === id)

  const onLike = useCallback(() => {
    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id
    })
  }, []);
  const onUnlike = useCallback(() => {
    dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id
    })
  }, []);
  const onToggleComment = useCallback(() => {
    setCommentFormOpenned(prev => !prev);
  })
  const onRemovePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    })
  }, [])

  const onRetweet = useCallback(() => {
    if(!id) {
      return alert('로그인이 필요합니다.');
    }

    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    })
  }, [id]);

  // useEffect(() => {
  //   console.log('rerendering.')
  //   if(retweetError) {
  //     alert(retweetError)
  //   }
  // }, [retweetError, ])
  // 여기다 이걸 하면 안되는 이유는 포스트 카드 수(트윗 수)만큼 리랜더링을 해버린다.
  // 상위로 올리면 괜찮을듯?
  // 또는 리트윗 에러에 리트윗 게시글 아이디까지 넣어서 해결하는 방법도 있다.

  return (
    <div>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images}></PostImages>}
        actions={[ // 배열 안에 jsx를 넣으면 항상 키를 넣어줘야한다.
          <RetweetOutlined key="retweet" onClick={onRetweet}></RetweetOutlined>,
          liked 
            ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike}></HeartTwoTone>
            : <HeartOutlined key="heart" onClick={onLike}></HeartOutlined>,
          <MessageOutlined key="comment" onClick={onToggleComment}></MessageOutlined>,
          <Popover key="more" content={(
            <Button.Group>
              {id && post.User.id === id 
                ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                  </>
                ) : 
                <Button>신고</Button>
              }
            </Button.Group>
          )}>
            <EllipsisOutlined></EllipsisOutlined>
          </Popover>
        ]}
        title={post.RetweetId ? `${post.User.nickname}님의 리트윗` : null}
        extra={id && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet
          ? (
            <Card
              cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
            >
              <div style={{ float: 'right' }}>{moment(post.createAt).format('YYYY.MM.DD')}</div>
              <Card.Meta
                avatar={(
                  <Link href={`/user/${post.Retweet.User.id}`}>
                    <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                  </Link>
                )}
                title={post.Retweet.User.nickname}
                description={<PostCardContent postData={post.Retweet.content}></PostCardContent>}
              ></Card.Meta>
            </Card>
          ) : (
            <>
              <div style={{ float: 'right' }}>{moment(post.createAt).format('YYYY.MM.DD')}</div>
              <Card.Meta
                avatar={(
                  <Link href={`/user/${post.User.id}`}>
                    <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                  </Link>
                )}
                title={post.User.nickname}
                description={<PostCardContent postData={post.content}></PostCardContent>}
              ></Card.Meta>
            </>
          )}

      </Card>
      { commentFormOpenned && (
        <>
          <CommentForm post={post}></CommentForm>
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={`/user/${item.User.id}`}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                >
                </Comment>
              </li>
            )}
          >
          </List>
        </>
      )}
    </div>
  );
};

PostCard.propTypes = {
  // post: PropTypes.object.isRequired,
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
}

export default PostCard;