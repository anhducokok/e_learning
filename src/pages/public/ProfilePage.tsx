import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import mb from "../../images/mb.jpg";

const AboutMePage: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80')",
      }}
    >

      <div className="text-center py-6">
        <h3 className="text-3xl font-bold">
          About <span className="text-yellow-500">Me</span>
        </h3>
      </div>

      <div className="container mx-auto mt-10 mb-10">
        <div className="bg-lime-300/70 rounded-xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/3 text-center">
              <img
                src={mb}
                alt="Avatar"
                className="rounded-lg mx-auto w-48 h-auto"
              />
            </div>

            <div className="w-full lg:w-2/3 mt-4 lg:mt-0">
              <p className="text-xl text-center">Hello</p>
              <div className="text-center">
                <p className="text-4xl font-bold">
                  <span className="text-blue-600">I'm</span> Ha
                </p>
                <p className="text-lg">
                  Verified <i className="bx bx-check text-green-600"></i>
                </p>
              </div>
              <hr className="my-4" />

              <div className="ml-8 space-y-2 text-xl">
                <div className="flex">
                  <div className="w-1/3 font-bold text-aquamarine">Tên:</div>
                  <div>Nguyễn Việt Hà</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 font-bold">Học tại:</div>
                  <div>THPT Chuyên DHV</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 font-bold">Lớp:</div>
                  <div>A4K53</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 font-bold">Tuổi:</div>
                  <div>21</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 font-bold">Ngày sinh:</div>
                  <div>xx/xx/2004</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 font-bold">Facebook:</div>
                  <div>
                    <a
                      href="https://www.facebook.com/"
                      className="text-blue-500 underline"
                    >
                      Việt Hà
                    </a>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/3 font-bold">Số điện thoại:</div>
                  <div>
                    0987654321
                    <br />
                    0123456789
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutMePage;
