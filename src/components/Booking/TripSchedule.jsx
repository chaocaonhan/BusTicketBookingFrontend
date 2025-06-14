import React, { useState, useEffect } from "react";
import axios from "axios";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";

const TripSchedule = ({ tripId }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8081/api/chuyenxe/lichTrinhChuyenXe`,
          {
            params: {
              idChuyenXe: tripId,
            },
          }
        );
        if (response.data.code === 200) {
          // Sort schedule by thuTu (order)
          const sortedSchedule = response.data.result.sort(
            (a, b) => a.thuTu - b.thuTu
          );
          setSchedule(sortedSchedule);
        }
      } catch (err) {
        setError("Không thể tải lịch trình");
        console.error("Error fetching schedule:", err);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchSchedule();
    }
  }, [tripId]);

  if (loading) {
    return <div className="text-center py-4">Đang tải lịch trình...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
          },
        }}
      >
        {schedule.map((stop, index) => (
          <TimelineItem key={stop.thuTu}>
            <TimelineOppositeContent color="textSecondary">
              {stop.thoiGianXeDen.slice(0, 5)}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  backgroundColor: "#ff9100", // Cam đậm như RouteSchedule
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "50%",
                    backgroundColor: "orange",
                    opacity: 0.4,
                    animation: "pulse 1s infinite ease-in-out",
                    zIndex: -1,
                  },
                  "@keyframes pulse": {
                    "0%": { transform: "scale(3.5)", opacity: 0.4 },
                    "50%": { transform: "scale(1.5)", opacity: 0 },
                    "100%": { transform: "scale(1)", opacity: 0.4 },
                  },
                }}
              />
              {index < schedule.length - 1 && (
                <TimelineConnector
                  sx={{
                    backgroundColor: "#f97316", // Cam nhạt như RouteSchedule
                  }}
                />
              )}
            </TimelineSeparator>
            <TimelineContent>
              <div className="font-medium">{stop.tenDiemDon}</div>
              {index > 0 && (
                <div className="text-sm text-gray-500">
                  Cách điểm đầu: {stop.khoangCahDenDiemDau}km
                </div>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

export default TripSchedule;
