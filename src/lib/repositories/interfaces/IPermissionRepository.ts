import type { VehiclePermission, Permission, Result } from '$lib/domain/types.js';

export interface IPermissionRepository {
	findById(id: string): Promise<Result<VehiclePermission | null>>;
	findByVehicleId(vehicleId: string): Promise<Result<VehiclePermission[]>>;
	findByUserId(userId: string): Promise<Result<VehiclePermission[]>>;
	findByVehicleAndUser(
		vehicleId: string,
		userId: string
	): Promise<Result<VehiclePermission | null>>;
	create(
		permission: Omit<VehiclePermission, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<Result<VehiclePermission>>;
	update(
		id: string,
		permission: Pick<VehiclePermission, 'permission'>
	): Promise<Result<VehiclePermission>>;
	delete(id: string): Promise<Result<void>>;
	deleteByVehicleAndUser(vehicleId: string, userId: string): Promise<Result<void>>;
	hasPermission(
		vehicleId: string,
		userId: string,
		requiredPermission: Permission
	): Promise<Result<boolean>>;
	getUsersWithAccess(
		vehicleId: string
	): Promise<Result<Array<VehiclePermission & { userEmail: string; userName: string }>>>;
}
