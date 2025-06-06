import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import tralelaPicture from "../../images/tralela.jpg";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center bg-white text-center px-4">
      <img
        src={tralelaPicture}
        alt="tralela"
        className="text-9xl font-extrabold text-red-400 mb-4"
      />

      <h2 className="text-2xl md:text-3xl font-semibold text-black mb-3">
        Yêu cầu thanh toán của bạn đã được gửi tới người có thẩm quyền.
      </h2>
      <p className="text-black max-w-md mb-6">
        Đơn hàng sẽ được xử lý trong vòng 24h kể từ lúc bạn thấy trang này!!!!!
        <br />
        Cảm ơn bạn đã làm giàu cho chúng tôi hẹ hẹ hẹ!!!!!!
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-[#A82828] text-gray-800 font-medium rounded hover:bg-yellow-500 transition-colors"
      >
        Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
