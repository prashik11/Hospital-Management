const { gql } = require("graphql-tag");

const typeDefs = gql`
  type OPDSchedule {
    day: String!
    startTime: String!
    endTime: String!
  }

  type Department {
    id: ID!
    name: String!
    description: String
  }

  type Doctor {
    id: ID!
    name: String!
    qualification: String!
    specialization: String!
    consultationFee: Float!
    opdSchedule: [OPDSchedule!]!
    department: Department
  }

  type Appointment {
    id: ID!
    appointmentNumber: String!
    patientName: String!
    mobile: String!
    reason: String
    doctor: Doctor!
    department: Department!
    date: String!
    time: String!
    status: String!
    createdAt: String!
  }

  input BookAppointmentInput {
    patientName: String!
    mobile: String!
    reason: String
    doctorId: ID!
    departmentId: ID!
    date: String!
    time: String!
  }

  type Query {
    doctors: [Doctor!]!
    doctor(id: ID!): Doctor

    departments: [Department!]!
    department(id: ID!): Department

    appointment(appointmentNumber: String!): Appointment
  }

  type Mutation {
    bookAppointment(input: BookAppointmentInput!): Appointment!
  }
`;

module.exports = typeDefs;