import {get, param} from '@loopback/rest';
import {LeaveRequest} from '../models';
import {service} from '@loopback/core';
import {GetPatientLeaveRequests} from '../application/query/patient/GetPatientLeaveRequests';

const BAD_REQUEST = 400;

export class MeController {
  constructor(
    @service('GetPatientLeaveRequests')
    private getPatientLeaveRequestsQuery: GetPatientLeaveRequests,
  ) {}

  @get('/me/leave-requests')
  async getPatientLeaveRequests(
    @param.header.string('X-User-Id') patientId: string,
  ): Promise<Partial<LeaveRequest>[]> {
    // TODO: patient ID  should be gotten from JWT token or session or whatever
    if (!patientId) {
      this.throwError('No patient id provided', BAD_REQUEST);
    }

    const leaveRequests = await this.getPatientLeaveRequestsQuery.apply(
      patientId,
    );

    return leaveRequests;
  }

  private throwError(message: string, code: number): void {
    const error = new Error(message);
    (<any>error).status = code;
    throw error;
  }
}
