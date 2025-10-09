 export function transformAttendanceData(apiData) {
  return apiData.attendances.map((user) => {
    const attendanceByDay = {};

    user.attendance.forEach((record) => {
      const day = parseInt(record.bs_date.split("-")[2], 10); // Extract day part

      attendanceByDay[day] = {
        present: !!record.check_in || !!record.check_out,
        check_in: record.check_in,
        check_out: record.check_out,
      };
    });

    return {
      employeeName: user.name,
      attendance: attendanceByDay,
    };
  });
}
