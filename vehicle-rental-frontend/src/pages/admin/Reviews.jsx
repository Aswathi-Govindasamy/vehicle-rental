import { useEffect, useState } from "react";
import {
  getAllReviews,
  approveReview,
  rejectReview,
} from "../../api/admin.api";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const rememberLoad = async () => {
    const data = await getAllReviews();
    setReviews(data.reviews);
    setLoading(false);
  };

  useEffect(() => {
    rememberLoad();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Review Moderation
        </h2>

        {reviews.length === 0 && (
          <p className="text-gray-400">No reviews found</p>
        )}

        {/* GRID */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow
                         hover:shadow-lg transition p-6 flex flex-col"
            >
              {/* HEADER */}
              <p className="text-sm font-medium text-white">
                {r.user.name}
                <span className="ml-2 text-yellow-400">
                  ⭐ {r.rating}
                </span>
              </p>

              {/* COMMENT */}
              {r.comment && (
                <p className="text-gray-400 text-sm mt-3">
                  {r.comment}
                </p>
              )}

              {/* STATUS */}
              <span
                className={`inline-block mt-4 px-3 py-1 text-xs font-semibold rounded-full w-fit
                  ${
                    r.approved
                      ? "bg-green-900/40 text-green-400"
                      : "bg-yellow-900/40 text-yellow-400"
                  }`}
              >
                {r.approved ? "APPROVED" : "PENDING"}
              </span>

              {/* ACTIONS */}
              {!r.approved && (
                <div className="mt-auto pt-5 flex gap-3">
                  <button
                    onClick={() => approveReview(r._id)}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm
                               hover:bg-green-700 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectReview(r._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm
                               hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
