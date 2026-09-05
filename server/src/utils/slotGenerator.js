const TimeSlot = require("../models/TimeSlot");
const Doctor = require("../models/Doctor");

const generateTimeSlots = async (doctorId, date) => {
  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  // Convert date to day name
  const selectedDate = new Date(`${date}T00:00:00`);

  if (isNaN(selectedDate.getTime())) {
    throw new Error("Invalid date");
  }

  const dayName = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Find doctor's schedule for that day
  const schedule = doctor.opdSchedule.find(
    (item) => item.day === dayName
  );

  if (!schedule) {
    return [];
  }

  const slots = [];

  const start = convertToMinutes(schedule.startTime);
  const end = convertToMinutes(schedule.endTime);

  for (let minutes = start; minutes < end; minutes += 30) {
    slots.push({
      doctorId,
      date,
      time: convertTo12HourFormat(minutes),
    });
  }

  // Insert only if slots don't already exist
  for (const slot of slots) {
    await TimeSlot.updateOne(
      {
        doctorId: slot.doctorId,
        date: slot.date,
        time: slot.time,
      },
      {
        $setOnInsert: slot,
      },
      {
        upsert: true,
      }
    );
  }

  return await TimeSlot.find({
    doctorId,
    date,
  }).sort({ time: 1 });
};

function convertToMinutes(time) {
  const [timePart, modifier] = time.split(" ");

  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

function convertTo12HourFormat(totalMinutes) {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const modifier = hours >= 12 ? "PM" : "AM";

  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  return `${hours}:${String(minutes).padStart(2, "0")} ${modifier}`;
}

module.exports = generateTimeSlots;