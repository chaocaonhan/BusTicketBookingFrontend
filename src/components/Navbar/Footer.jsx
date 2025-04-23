import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-orange-500 pt-1 text-neutral-50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid mt-2 grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h2 className="text-2xl font-bold ">Sao Việt</h2>
            </Link>
            <p className="mb-4">
              Nhà xe uy tín hàng đầu Việt Nam, chuyên phục vụ các tuyến đường
              dài liên tỉnh với chất lượng dịch vụ tốt nhất.
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
              <li>
                <a
                  href="#"
                  className="text-neutral-50 hover:text-white transition-colors"
                >
                  Lào Cai - Hà Nội
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-50 hover:text-white transition-colors"
                >
                  Lào Cai - Bắc Ninh
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-50 hover:text-white transition-colors"
                >
                  Lào Cai - Hải Phòng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-50 hover:text-white transition-colors"
                >
                  Sapa - Hà Nội
                </a>
              </li>
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
                  to="/about"
                  className="text-neutral-50 hover:text-white transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/routes"
                  className="text-neutral-50 hover:text-white transition-colors"
                >
                  Tuyến đường
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-neutral-50 hover:text-white transition-colors"
                >
                  Liên hệ
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

        <div className="border-t-2 border-neutral-200 mt-10 pt-6 text-center">
          <p>
            © {new Date().getFullYear()} Sao Việt. Tất cả các quyền được bảo
            lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
