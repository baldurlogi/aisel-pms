'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PatientSchema = exports.UpdatePatientSchema = exports.CreatePatientSchema = void 0;
const zod_1 = require('zod');
exports.CreatePatientSchema = zod_1.z.object({
  firstName: zod_1.z.string().min(1),
  lastName: zod_1.z.string().min(1),
  email: zod_1.z.string().email(),
  phoneNumber: zod_1.z.string().optional(),
  dob: zod_1.z.string(),
});
exports.UpdatePatientSchema = exports.CreatePatientSchema.partial();
exports.PatientSchema = exports.CreatePatientSchema.extend({
  id: zod_1.z.string(),
});
//# sourceMappingURL=patient.schema.js.map
