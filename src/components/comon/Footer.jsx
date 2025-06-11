import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import axios from "axios";

const Footer = () => {
  const [popularRoutes, setPopularRoutes] = useState([]);

  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/tuyen-xe/top5-popular"
        );
        if (response.data.code === 200) {
          setPopularRoutes(response.data.result.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching popular routes:", error);
      }
    };

    fetchPopularRoutes();
  }, []);

  return (
    <footer className="bg-orange-500 pt-1 text-neutral-50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid mt-2 grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h2 className="text-2xl font-bold ">Sao Việt</h2>
            </Link>
            <p className="mb-4">
              Nhà xe uy tín hàng đầu Việt Nam, chuyên phục vụ tuyến đường Lào
              Cai - Hà Nội với chất lượng dịch vụ tốt nhất.
            </p>
            <div className=" text-white flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className=" hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className=" hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Tuyến phổ biến
            </h3>
            <ul className="space-y-2">
              {popularRoutes.map((route) => (
                <li key={route.id}>
                  <a
                    href={`http://localhost:3000/route-schedule/${route.id}`}
                    className="text-neutral-50 hover:text-white transition-colors"
                  >
                    {route.tenTuyen}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-neutral-50 hover:text-white transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="text-neutral-50 hover:text-white transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/tuyen-duong"
                  className="text-neutral-50 hover:text-white transition-colors"
                >
                  Tuyến đường
                </Link>
              </li>
              <li>
                <Link
                  to="/tra-cuu-ve"
                  className="text-neutral-50 hover:text-white transition-colors"
                >
                  Tra cứu vé
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Liên hệ</h3>
            <ul className="space-y-3 t">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2  shrink-0 mt-1" />
                <span>Bến xe trung tâm Lào Cai</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 " />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 " />
                <span>info@saoviet.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-neutral-200 mt-3 py-4 text-center">
          <p>
            © {new Date().getFullYear()} | Bản quyền thuộc về công ty Sao Việt
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
