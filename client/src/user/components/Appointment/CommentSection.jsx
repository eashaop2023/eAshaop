import React, { useState } from 'react';
import { TextField, Button, Avatar, Typography, Box, Paper, IconButton } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

function CommentSection() {
    const currentUser = {
        username: 'Current User',
        avatar: '/path/to/avatar.jpg',
    };

    const [comments, setComments] = useState([
        { id: 1, username: 'Alice', avatar: '/path/to/avatar1.jpg', timestamp: new Date().toLocaleString(), text: 'This is a great post!', replies: [], likes: 0, liked: false, dislikes: 0, disliked: false },
        { id: 2, username: 'Bob', avatar: '/path/to/avatar2.jpg', timestamp: new Date().toLocaleString(), text: 'Thanks for sharing this.', replies: [], likes: 0, liked: false, dislikes: 0, disliked: false },
        { id: 3, username: 'Charlie', avatar: '/path/to/avatar3.jpg', timestamp: new Date().toLocaleString(), text: 'I learned something new today.', replies: [], likes: 0, liked: false, dislikes: 0, disliked: false },
        { id: 4, username: 'Diana', avatar: '/path/to/avatar4.jpg', timestamp: new Date().toLocaleString(), text: 'Interesting perspective!', replies: [], likes: 0, liked: false, dislikes: 0, disliked: false },
        { id: 5, username: 'Eve', avatar: '/path/to/avatar5.jpg', timestamp: new Date().toLocaleString(), text: 'Looking forward to more posts like this.', replies: [], likes: 0, liked: false, dislikes: 0, disliked: false },
    ]);

    const [newCommentText, setNewCommentText] = useState('');

    const handleAddComment = () => {
        if (newCommentText.trim()) {
            const newComment = {
                id: Date.now(),
                username: currentUser.username,
                avatar: currentUser.avatar,
                timestamp: new Date().toLocaleString(),
                text: newCommentText,
                replies: [],
                likes: 0,
                liked: false,
                dislikes: 0,
                disliked: false,
            };
            setComments([newComment, ...comments]);
            setNewCommentText('');
        }
    };

    const handleEditComment = (id, newText) => {
        setComments(comments.map(c => c.id === id ? { ...c, text: newText } : c));
    };

    const handleAddReply = (commentId, replyText, user) => {
        setComments(
            comments.map(c =>
                c.id === commentId
                    ? {
                        ...c,
                        replies: [
                            ...c.replies,
                            {
                                id: Date.now(),
                                text: replyText,
                                username: user.username,
                                avatar: user.avatar,
                                timestamp: new Date().toLocaleString(),
                                likes: 0,
                                liked: false,
                                dislikes: 0,
                                disliked: false,
                            },
                        ],
                    }
                    : c
            )
        );
    };

    const handleToggleLike = (commentId) => {
        setComments(prev => prev.map(c => {
            if (c.id !== commentId) return c;
            const liked = !c.liked;
            const likes = liked ? c.likes + 1 : Math.max(0, c.likes - 1);
            return { ...c, liked, likes, ...(liked ? { disliked: false } : {}) };
        }));
    };

    const handleToggleDislike = (commentId) => {
        setComments(prev => prev.map(c => {
            if (c.id !== commentId) return c;
            const disliked = !c.disliked;
            const dislikes = disliked ? c.dislikes + 1 : Math.max(0, c.dislikes - 1);
            return { ...c, disliked, dislikes, ...(disliked ? { liked: false } : {}) };
        }));
    };

    const handleToggleLikeReply = (commentId, replyId) => {
        setComments(prev => prev.map(c => {
            if (c.id !== commentId) return c;
            const replies = c.replies.map(r => {
                if (r.id !== replyId) return r;
                const liked = !r.liked;
                const likes = liked ? r.likes + 1 : Math.max(0, r.likes - 1);
                return { ...r, liked, likes, ...(liked ? { disliked: false } : {}) };
            });
            return { ...c, replies };
        }));
    };

    const handleToggleDislikeReply = (commentId, replyId) => {
        setComments(prev => prev.map(c => {
            if (c.id !== commentId) return c;
            const replies = c.replies.map(r => {
                if (r.id !== replyId) return r;
                const disliked = !r.disliked;
                const dislikes = disliked ? r.dislikes + 1 : Math.max(0, r.dislikes - 1);
                return { ...r, disliked, dislikes, ...(disliked ? { liked: false } : {}) };
            });
            return { ...c, replies };
        }));
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4}}>
            {!comments.some(c => c.username === currentUser.username) && (
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={1}
                        placeholder="Write a comment..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleAddComment}
                        sx={{ backgroundColor: "rgb(0, 169, 157)" }}
                    >
                        Post Comment
                    </Button>
                </Paper>
            )}

            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUser={currentUser}
                    onEdit={handleEditComment}
                    onReply={handleAddReply}
                    onToggleLike={handleToggleLike}
                    onToggleDislike={handleToggleDislike}
                    onToggleLikeReply={handleToggleLikeReply}
                    onToggleDislikeReply={handleToggleDislikeReply}
                />
            ))}
        </Box>
    );
}

function CommentItem({ comment, currentUser, onEdit, onReply, onToggleLike, onToggleDislike, onToggleLikeReply, onToggleDislikeReply }) {
    const [editingText, setEditingText] = useState(comment.text);
    const [showEditInput, setShowEditInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showReplyInput, setShowReplyInput] = useState(false);
    const isOwner = comment.username === currentUser.username;

    const handleReplyClick = () => {
        setShowReplyInput(!showReplyInput);
        setReplyText(`@${comment.username} `);
    };

    const handleEditClick = () => {
        setShowEditInput(!showEditInput);
        setEditingText(comment.text);
    };

    return (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Avatar src={comment.avatar} sx={{ mr: 1 }} />
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="subtitle2">{comment.username}</Typography>
                            <Typography variant="caption" color="text.secondary">{comment.timestamp}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small" onClick={() => onToggleLike(comment.id)} aria-label="like comment">
                                {comment.liked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
                            </IconButton>
                            <Typography variant="caption" sx={{ mr: 1 }}>{comment.likes}</Typography>

                            <IconButton size="small" onClick={() => onToggleDislike(comment.id)} aria-label="dislike comment">
                                {comment.disliked ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOutlinedIcon fontSize="small" />}
                            </IconButton>
                            <Typography variant="caption">{comment.dislikes}</Typography>
                        </Box>
                    </Box>

                    <Typography variant="body1" sx={{ mt: 0.5 }}>{comment.text}</Typography>

                    <Box sx={{ mt: 1 }}>
                        <Button size="small" onClick={handleReplyClick}>Reply</Button>
                        {isOwner && <Button size="small" onClick={handleEditClick}>Edit</Button>}
                    </Box>

                    {comment.replies.map(reply => (
                        <Box key={reply.id} sx={{ mt: 1, pl: 0, display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: '6px' }}>
                                <IconButton size="small" onClick={() => onToggleLikeReply(comment.id, reply.id)} aria-label="like reply">
                                    {reply.liked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
                                </IconButton>
                                <Typography variant="caption">{reply.likes}</Typography>

                                <IconButton size="small" onClick={() => onToggleDislikeReply(comment.id, reply.id)} aria-label="dislike reply">
                                    {reply.disliked ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOutlinedIcon fontSize="small" />}
                                </IconButton>
                                <Typography variant="caption">{reply.dislikes}</Typography>
                            </Box>

                            <Box sx={{ pl: 1, borderLeft: '2px solid #eee', flex: 1 }}>
                                <Typography variant="subtitle2">{reply.username}</Typography>
                                <Typography variant="caption" color="text.secondary">{reply.timestamp}</Typography>
                                <Typography sx={{ mt: 0.3 }}>{reply.text}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            {showReplyInput && (
                <Box sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={1}
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => {
                            if (replyText.trim()) {
                                onReply(comment.id, replyText, currentUser);
                                setReplyText('');
                                setShowReplyInput(false);
                            }
                        }}
                    >
                        Post Reply
                    </Button>
                </Box>
            )}

            {showEditInput && (
                <Box sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={1}
                        placeholder="Edit your comment..."
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                            if (editingText.trim()) {
                                onEdit(comment.id, editingText);
                                setShowEditInput(false);
                            }
                        }}
                    >
                        Save Edit
                    </Button>
                </Box>
            )}
        </Paper>
    );
}

export default CommentSection;
