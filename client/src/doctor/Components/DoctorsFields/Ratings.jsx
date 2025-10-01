import React from "react";
import { FaStar, FaRegStar, FaRegCommentDots } from "react-icons/fa";

const ratingsData = [
  { stars: 5, count: 100 },
  { stars: 4, count: 60 },
  { stars: 3, count: 30 },
  { stars: 2, count: 20 },
  { stars: 1, count: 10 },
];

const reviews = [
  {
    name: "Pravalika",
    date: "Sep 29, 2025",
    rating: 5,
    review:
      "Dr. Smith is an outstanding physician! She listened attentively to all my concerns and provided clear, comprehensive explanations. Her compassionate approach made me feel at ease, and the treatment plan she recommended has already shown great results. Highly recommend her!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Murani",
    date: "Sep 29, 2025",
    rating: 5,
    review:
      "Dr. Smith is an outstanding physician! She listened attentively to all my concerns and provided clear, comprehensive explanations. Her compassionate approach made me feel at ease, and the treatment plan she recommended has already shown great results. Highly recommend her!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sanjay",
    date: "Sep 29, 2025",
    rating: 5,
    review:
      "Dr. Smith is an outstanding physician! She listened attentively to all my concerns and provided clear, comprehensive explanations. Her compassionate approach made me feel at ease, and the treatment plan she recommended has already shown great results. Highly recommend her!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

const ReviewsPage = () => {
  const totalReviews = ratingsData.reduce((acc, cur) => acc + cur.count, 0);
  const avgRating = (
    ratingsData.reduce((acc, cur) => acc + cur.stars * cur.count, 0) /
    totalReviews
  ).toFixed(1);

  return (
    <div className="ml-0 md:pl-[80px] lg:pl-[327px] mt-[85px] md:mt-[95px] lg:mt-[80px] font-urbanist px-4 sm:px-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6 lg:text-left hidden lg:block">
    Reviews and Ratings
  </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select className="border border-[#F7F7F7] rounded-md px-4 py-2 w-full sm:w-auto">
          <option>All Stars</option>
        </select>
        <select className="border border-[#F7F7F7] rounded-md px-4 py-2 w-full sm:w-auto">
          <option>Latest</option>
        </select>
        <input
          type="text"
          placeholder="Search by Patient Name"
          className="border border-[#F7F7F7] rounded-md px-4 py-2 w-full sm:flex-1"
        />
      </div>

      {/* Ratings and Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rating Overview */}
        <div className="col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <span className="text-4xl font-bold">{avgRating}</span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <span className="text-gray-600">({totalReviews} Reviews)</span>
          </div>
          {ratingsData.map((item, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <span className="w-6 text-gray-600">{item.stars}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3 mx-2">
                <div
                  className="bg-teal-500 h-3 rounded-full"
                  style={{
                    width: `${(item.count / totalReviews) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Insights */}
        <div className="border border-[#F7F7F7] rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3">Quick Insights</h2>
          <p className="flex items-center gap-2 text-gray-700 mb-2">
            <FaRegStar /> Average Rating: {avgRating}/5
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <FaRegCommentDots /> Reviews this week: 7
          </p>
        </div>
      </div>

      {/* Review Cards - 2 per row */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r, idx) => (
          <div
            key={idx}
            className="border border-[#F7F7F7] rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start"
          >
            <img
              src={r.avatar}
              alt={r.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                <span className="font-medium">{r.name}</span>
                <span className="flex items-center gap-2 text-sm text-gray-500 mt-1 sm:mt-0">
                  <div className="flex text-yellow-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <FaStar key={i} size={14} />
                    ))}
                  </div>
                  {r.date}
                </span>
              </div>
              <p className="text-gray-700 text-sm sm:text-base">{r.review}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
