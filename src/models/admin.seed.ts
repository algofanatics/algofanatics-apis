import { RegisterType, UserInterface } from "../@types"
import { userService } from "../service"
import { logger } from "../config"

const admins: RegisterType[] = [
  {
    username: 'samsonajulor',
    email: 'samsonajulor@gmail.com',
    isActive: true,
    isAdmin: true,
  },
];

export const seedAdmins = async () => {
  try {
    for await (const admin of admins) {
      const existingAdmin = await userService.getUserByEmail(admin.email as string)
      if (!existingAdmin) {
        await userService.createUser(admin)
        logger('seeding', `${admin.email} seeded successfully.`);
      } else {
       logger('seeding...', `${admin.email} already exists`);
       // update existing admin status
       await userService.updateUser(String(existingAdmin._id), {
         isAdmin: true,
       } as unknown as UserInterface);
       logger('seeding...', `${admin.email} updated successfully.`);
      }
    }
  } catch (error: any) {
    logger('error from seed', String(error))
  }
}