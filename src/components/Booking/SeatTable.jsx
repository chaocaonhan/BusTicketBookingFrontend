import React from "react";
import seat_disabled from "../../assets/seat_disabled.svg";
import seat_selecting from "../../assets/seat_selecting.svg";
import seat_active from "../../assets/seat_active.svg";

const SeatTable = ({
  seatData,
  onSeatsSelected,
  selectedSeats,
  pricePerSeat,
}) => {
  // Group seats by floor
  const seatsByFloor = seatData.reduce((acc, seat) => {
    const floor = seat.floorNo;
    if (!acc[floor]) {
      acc[floor] = [];
    }
    acc[floor].push(seat);
    return acc;
  }, {});

  // Sort seats by row and column
  Object.keys(seatsByFloor).forEach((floor) => {
    seatsByFloor[floor].sort((a, b) => {
      if (a.rowNo !== b.rowNo) return a.rowNo - b.rowNo;
      return a.columnNo - b.columnNo;
    });
  });

  const handleSeatClick = (seat) => {
    if (seat.bookStatus === 1) return; // Không cho phép chọn ghế đã bán

    const isSelected = selectedSeats.find((s) => s.id === seat.id);
    const newSelectedSeats = isSelected
      ? selectedSeats.filter((s) => s.id !== seat.id)
      : [...selectedSeats, seat];

    onSeatsSelected(newSelectedSeats);
  };

  const getSeatImage = (seat) => {
    if (seat.bookStatus === 1) {
      return seat_disabled;
    }
    if (selectedSeats.find((s) => s.id === seat.id)) {
      return seat_selecting;
    }
    return seat_active;
  };

  const getSeatTextColor = (seat) => {
    if (seat.bookStatus === 1) {
      return "text-[#A2ABB3]";
    }
    if (selectedSeats.find((s) => s.id === seat.id)) {
      return "text-[#F8BEAB]";
    }
    return "text-[#339AF4]";
  };

  return (
    <div className="mt-2 flex h-96 justify-center overflow-y-auto rounded-b-xl bg-[#FBFBFB] px-1 pb-4">
      <div className="flex w-full flex-col items-center">
        <div className="max-w-md">
          <div className="min-w-sm mx-auto flex w-[100%] max-w-2xl flex-col px-3 py-1 sm:px-6 2lg:mx-0 2lg:w-auto">
            <div className="flex justify-between text-[13px] font-normal">
              <span className="mr-8 flex items-center">
                <div className="mr-2 h-4 w-4 rounded bg-[#D5D9DD] border-[#C0C6CC]"></div>
                Đã bán
              </span>
              <span className="mr-8 flex items-center">
                <div className="mr-2 h-4 w-4 rounded bg-[#DEF3FF] border-[#96C5E7]"></div>
                Còn trống
              </span>
              <span className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded bg-[#FDEDE8] border-[#F8BEAB]"></div>
                Đang chọn
              </span>
            </div>

            <div className="my-4 flex flex-row text-center font-medium gap-4 sm:gap-6 justify-center">
              {Object.entries(seatsByFloor).map(([floor, seats]) => (
                <div
                  key={floor}
                  className="flex min-w-[50%] flex-col md:min-w-[153px]"
                >
                  <div className="icon-gray flex w-full justify-center p-2 text-sm">
                    <span>Tầng {floor === "1" ? "dưới" : "trên"}</span>
                  </div>
                  <div className="divide mb-4 2lg:hidden"></div>
                  <table>
                    <tbody>
                      {Array.from(new Set(seats.map((seat) => seat.rowNo))).map(
                        (rowNo) => (
                          <tr
                            key={rowNo}
                            className="flex items-center gap-1 justify-between"
                          >
                            {seats
                              .filter((seat) => seat.rowNo === rowNo)
                              .map((seat) => (
                                <React.Fragment key={seat.id}>
                                  <td
                                    className={`relative mt-1 flex justify-center text-center ${
                                      seat.bookStatus === 1
                                        ? "cursor-not-allowed"
                                        : "cursor-pointer"
                                    }`}
                                    onClick={() => handleSeatClick(seat)}
                                  >
                                    <img
                                      width="38"
                                      src={getSeatImage(seat)}
                                      alt="seat icon"
                                    />
                                    <span
                                      className={`absolute text-sm font-semibold lg:text-[10px] ${getSeatTextColor(
                                        seat
                                      )} top-1`}
                                    >
                                      {seat.chair}
                                    </span>
                                  </td>
                                  {seat.columnNo % 2 === 1 &&
                                    seat.columnNo < 5 && (
                                      <td
                                        style={{
                                          position: "relative",
                                          width: "24px",
                                        }}
                                      ></td>
                                    )}
                                </React.Fragment>
                              ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="divide mb-3"></div>
      </div>
    </div>
  );
};

export default SeatTable;
