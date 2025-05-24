import React from "react";
import { Shield, Clock, Award, Heart } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "An toàn",
    description:
      "Đội ngũ tài xế giàu kinh nghiệm, xe được kiểm định chất lượng thường xuyên.",
  },
  {
    icon: Clock,
    title: "Đúng giờ",
    description:
      "Tỷ lệ chuyến xe khởi hành đúng giờ lên đến 98%, cam kết thời gian đến nơi.",
  },
  {
    icon: Award,
    title: "Chất lượng",
    description:
      "Xe đời mới, ghế rộng, tiện nghi hiện đại, phục vụ nước uống và khăn lạnh.",
  },
  {
    icon: Heart,
    title: "Tiện nghi",
    description:
      "WiFi miễn phí, ổ cắm điện, chăn mền, nhà vệ sinh sạch sẽ trên xe.",
  },
];

const BusFeatures = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl text-orange-500 font-bold mb-4">
            Tại sao bạn nên chọn Sao Việt?
          </h2>
          <p className="text-gray-600">
            Chúng tôi không ngừng nâng cao chất lượng dịch vụ để mang đến trải
            nghiệm tốt nhất cho hành khách
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-amber-50  p-6 rounded-lg shadow-sm transition-all hover:shadow-md flex flex-col items-center text-center"
            >
              <div className="w-16 h-16  flex items-center justify-center rounded-full bg-white mb-4">
                <feature.icon size={28} className="text-orange-500" />
              </div>
              <h3 className="text-lg text-[#23374d] font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusFeatures;
