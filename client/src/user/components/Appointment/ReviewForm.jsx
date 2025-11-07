import React, { useState, useEffect } from 'react';
import { Box, Rating, TextField, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { API_BASE_URL } from '../../../api-config';
import { toast } from 'react-toastify';

const ReviewForm = ({ rating = 0,doctorId,userId }) => {

  // console.log(rating,doctorId,userId);
  
  const [ratingValue, setRatingValue] = useState(0);
  // const [comment, setComment] = useState('');

  useEffect(() => {
    const numeric = Number(rating);
    if (!isNaN(numeric)) {
      const rounded = Math.round(numeric * 2) / 2;
      setRatingValue(rounded);
    } else {
      setRatingValue(0);
    }
  }, [rating]);

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log('Submitted Review:', { rating: ratingValue });
  //   // setRatingValue(0);
  //   // setComment('');
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "doctorId": doctorId,
          "userId": userId,
          "rating": ratingValue,
          // "comment": "Chaitanya Naidu is a doctor"
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");
      toast.success(data.message || "Message sent successfully!");
      console.log("DATA",data);

    } catch (err) {
      toast.error(err.message);
    } finally {
      // setLoading(false);
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        padding: 3,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}
    >
      <Rating
        name="text-feedback"
        value={ratingValue}
        precision={0.5}
        icon={<StarIcon sx={{ fontSize: 40 }} />}
        emptyIcon={<StarIcon sx={{ opacity: 0.3, fontSize: 40 }} />}
        onChange={(event, newValue) => setRatingValue(newValue)}
      />

      {/* <TextField
        label="Your comment"
        multiline
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        variant="outlined"
        fullWidth
        placeholder="Write your review..."
      /> */}


      <Button type="submit" sx={{ backgroundColor: "rgb(0, 169, 157)" }} variant="contained" color="primary" fullWidth>
        Submit Review
      </Button>
    </Box>
  );
};

export default ReviewForm;

// import React, { useState, useEffect } from 'react';
// import { Box, Rating, TextField, Button, Typography } from '@mui/material';
// import StarIcon from '@mui/icons-material/Star';

// const ReviewForm = ({ rating = 0 }) => {
//   const [ratingValue, setRatingValue] = useState(0);
//   const [comment, setComment] = useState('');
//   const [postedComment, setPostedComment] = useState(null);
//   const [reply, setReply] = useState('');

//   useEffect(() => {
//     const numeric = Number(rating);
//     if (!isNaN(numeric)) {
//       const rounded = Math.round(numeric * 2) / 2;
//       setRatingValue(rounded);
//     } else {
//       setRatingValue(0);
//     }
//   }, [rating]);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setPostedComment({ rating: ratingValue, comment });
//     setComment(''); // Clear input after posting
//   };

//   const handleReplySubmit = (event) => {
//     event.preventDefault();
//     setPostedComment((prev) => ({ ...prev, reply }));
//     setReply('');
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: 2,
//         maxWidth: 400,
//         margin: 'auto',
//         padding: 3,
//         borderRadius: 2,
//         boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//         backgroundColor: '#fff',
//       }}
//     >
//       {!postedComment ? (
//         // Form to post new comment
//         <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//           <Rating
//             name="text-feedback"
//             value={ratingValue}
//             precision={0.5}
//             icon={<StarIcon sx={{ fontSize: 40 }} />}
//             emptyIcon={<StarIcon sx={{ opacity: 0.3, fontSize: 40 }} />}
//             onChange={(event, newValue) => setRatingValue(newValue)}
//           />

//           <TextField
//             label="Your comment"
//             multiline
//             rows={2}
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             variant="outlined"
//             fullWidth
//             placeholder="Write your review..."
//             sx={{ mt: 2 }}
//           />

//           <Button
//             type="submit"
//             sx={{ mt: 2, backgroundColor: 'rgb(0, 169, 157)' }}
//             variant="contained"
//             color="primary"
//             fullWidth
//           >
//             Submit Review
//           </Button>
//         </Box>
//       ) : (
//         // Display posted comment and reply box
//         <Box sx={{ width: '100%' }}>
//           <Typography variant="h6">Your Review:</Typography>
//           <Rating
//             name="read-only"
//             value={postedComment.rating}
//             precision={0.5}
//             readOnly
//             icon={<StarIcon sx={{ fontSize: 30 }} />}
//             emptyIcon={<StarIcon sx={{ opacity: 0.3, fontSize: 30 }} />}
//           />
//           <Typography sx={{ mt: 1 }}>{postedComment.comment}</Typography>

//           {postedComment.reply && (
//             <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid #ccc' }}>
//               <Typography variant="subtitle2">Reply:</Typography>
//               <Typography>{postedComment.reply}</Typography>
//             </Box>
//           )}

//           {/* Reply form */}
//           {!postedComment.reply && (
//             <Box component="form" onSubmit={handleReplySubmit} sx={{ mt: 2 }}>
//               <TextField
//                 label="Reply to your comment"
//                 multiline
//                 rows={1}
//                 value={reply}
//                 onChange={(e) => setReply(e.target.value)}
//                 variant="outlined"
//                 fullWidth
//                 placeholder="Write a reply..."
//               />
//               <Button
//                 type="submit"
//                 sx={{ mt: 1, backgroundColor: 'rgb(0, 169, 157)' }}
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//               >
//                 Submit Reply
//               </Button>
//             </Box>
//           )}

//           {/* Edit comment */}
//           <Button
//             sx={{ mt: 2 }}
//             variant="outlined"
//             fullWidth
//             onClick={() => {
//               setComment(postedComment.comment);
//               setRatingValue(postedComment.rating);
//               setPostedComment(null);
//             }}
//           >
//             Edit Comment
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ReviewForm;

