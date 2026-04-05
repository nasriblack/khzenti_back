import { normalizeEmail } from "../utils/validators";
import { normalizeIp } from "../utils/ipHelper";
import { ServiceResult, WhitelistDTO } from "../types";
import prisma from "../config/databse";

/**
 * Service class for whitelist operations
 */
export class WhitelistService {
  /**
   * Add email to whitelist with IP-based constraint
   */
  async addToWhitelist(
    email: string,
    ipAddress: string,
    userAgent?: string,
  ): Promise<ServiceResult<WhitelistDTO>> {
    try {
      const normalizedEmail = normalizeEmail(email);
      const normalizedIp = normalizeIp(ipAddress);

      // Check if IP has already submitted an email
      const existingIpEntry = await prisma.whitelist.findFirst({
        where: { ipAddress: normalizedIp },
      });

      if (existingIpEntry) {
        return {
          success: false,
          error: "This IP address has already submitted an email",
          statusCode: 403,
        };
      }

      // Check if email already exists (will be caught by unique constraint, but check explicitly)
      const existingEmail = await prisma.whitelist.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingEmail) {
        return {
          success: false,
          error: "Email already registered in whitelist",
          statusCode: 409,
        };
      }

      // Create whitelist entry
      const whitelistEntry = await prisma.whitelist.create({
        data: {
          email: normalizedEmail,
          ipAddress: normalizedIp,
          userAgent: userAgent || null,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      return {
        success: true,
        data: whitelistEntry,
        statusCode: 201,
      };
    } catch (error: any) {
      // Handle Prisma unique constraint error
      if (error.code === "P2002") {
        return {
          success: false,
          error: "Email already registered in whitelist",
          statusCode: 409,
        };
      }

      // Log unexpected errors
      console.error("WhitelistService Error:", error);

      return {
        success: false,
        error: "Failed to add email to whitelist",
        statusCode: 500,
      };
    }
  }

  /**
   * Get all whitelist entries (for admin purposes)
   */
  async getAllWhitelistEntries(): Promise<ServiceResult<WhitelistDTO[]>> {
    try {
      const entries = await prisma.whitelist.findMany({
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        success: true,
        data: entries,
        statusCode: 200,
      };
    } catch (error) {
      console.error("WhitelistService Error:", error);
      return {
        success: false,
        error: "Failed to fetch whitelist entries",
        statusCode: 500,
      };
    }
  }

  /**
   * Check if email exists in whitelist
   */
  // async checkEmail(email: string | any): Promise<ServiceResult<{ exists: boolean }>> {
  //   try {
  //     const normalizedEmail = normalizeEmail(email);
  //     const entry = await prisma.whitelist.findUnique({
  //       where: { email: normalizedEmail },
  //     });

  //     return {
  //       success: true,
  //       data: { exists: !!entry },
  //       statusCode: 200,
  //     };
  //   } catch (error) {
  //     console.error('WhitelistService Error:', error);
  //     return {
  //       success: false,
  //       error: 'Failed to check email',
  //       statusCode: 500,
  //     };
  //   }
  // }
}

export const whitelistService = new WhitelistService();
