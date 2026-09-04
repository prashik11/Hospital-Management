const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const Appointment = require("../models/Appointment");

const generateAppointmentNumber = async () => {
  const year = new Date().getFullYear();

  const count = await Appointment.countDocuments();

  const number = String(count + 1).padStart(5, "0");

  return `HSP-${year}-${number}`;
};

const resolvers = {
  Query: {
    doctors: async () => {
      return await Doctor.find({ active: true });
    },

    doctor: async (_, { id }) => {
      return await Doctor.findById(id);
    },

    departments: async () => {
      return await Department.find({ active: true });
    },

    department: async (_, { id }) => {
      return await Department.findById(id);
    },

    appointment: async (_, { appointmentNumber }) => {
      return await Appointment.findOne({
        appointmentNumber,
      });
    },
  },

  Mutation: {
    bookAppointment: async (_, { input }) => {
      const {
        patientName,
        mobile,
        reason,
        doctorId,
        departmentId,
        date,
        time,
      } = input;

      // Check doctor
      const doctor = await Doctor.findById(doctorId);

      if (!doctor || !doctor.active) {
        throw new Error("Doctor not found");
      }

      // Check department
      const department = await Department.findById(departmentId);

      if (!department || !department.active) {
        throw new Error("Department not found");
      }

      // Check whether slot is already booked
      const existingAppointment = await Appointment.findOne({
        doctorId,
        date,
        time,
        status: "CONFIRMED",
      });

      if (existingAppointment) {
        throw new Error("This time slot is already booked");
      }

      // Generate appointment number
      const appointmentNumber = await generateAppointmentNumber();

      // Create appointment
      const appointment = await Appointment.create({
        appointmentNumber,
        patientName,
        mobile,
        reason,
        doctorId,
        departmentId,
        date,
        time,
        status: "CONFIRMED",
      });

      return appointment;
    },
  },

  Doctor: {
    id: (parent) => parent._id.toString(),

    department: async (parent) => {
      return await Department.findById(parent.departmentId);
    },
  },

  Department: {
    id: (parent) => parent._id.toString(),
  },

  Appointment: {
    id: (parent) => parent._id.toString(),

    doctor: async (parent) => {
      return await Doctor.findById(parent.doctorId);
    },

    department: async (parent) => {
      return await Department.findById(parent.departmentId);
    },

    createdAt: (parent) => parent.createdAt.toISOString(),
  },
};

module.exports = resolvers;