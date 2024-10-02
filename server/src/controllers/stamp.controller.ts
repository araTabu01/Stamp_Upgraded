import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

const prisma = new PrismaClient();

export const createStamp = async (req: Request, res: Response) => {
  try {
    const { stampData } = req.body;

    if (!stampData) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid input data", "Bad Request"));
    }

    const {
      date,
      branch,
      name,
      documentType,
      authorizer,
      documentName,
      kindOfStamp,
      numberOfStamp,
      reason,
      approvalDate,
      approver,
      approvedStatus,
      substituteName,
    } = stampData; // Extract the first object from the array

    // Convert date strings to Date objects if necessary
    const parsedDate = date ? new Date(date) : null;
    const parsedApprovalDate = approvalDate ? new Date(approvalDate) : null;
    const parsedNumberOfStamp = numberOfStamp
      ? parseInt(numberOfStamp, 10)
      : null;

    const stamp = await prisma.stamp.create({
      data: {
        date: parsedDate,
        branch,
        name,
        documentType,
        authorizer,
        documentName,
        kindOfStamp,
        numberOfStamp: parsedNumberOfStamp,
        reason,
        approvalDate: parsedApprovalDate,
        approver,
        approvedStatus,
        substituteName,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, stamp, "Stamp created successfully"));
  } catch (error: any) {
    return res
      .status(500)
      .json(new ApiError(500, error.message, "Internal Server Error"));
  }
};
export const getStamps = async (req: Request, res: Response) => {
  try {
    const stamps = await prisma.stamp.findMany();
    return res
      .status(200)
      .json(new ApiResponse(200, stamps, "Stamps retrieved successfully"));
  } catch (error: any) {
    return res
      .status(500)
      .json(new ApiError(500, error.message, "Internal Server Error"));
  }
};

export const deleteStamp = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.stamp.delete({ where: { id } });
    return res
      .status(204)
      .json(new ApiResponse(204, {}, "Stamp deleted successfully"));
  } catch (error: any) {
    return res
      .status(500)
      .json(new ApiError(500, error.message, "Internal Server Error"));
  }
};

export const updateApprovalDate = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const { approvalDate } = req.body;
    const { isApproved } = req.body;

    let updatedStamp;
    if (approvalDate) {
      updatedStamp = await prisma.stamp.update({
        where: { id },
        data: { approvalDate: new Date(approvalDate) },
      });
    } else if (isApproved) {
      updatedStamp = await prisma.stamp.update({
        where: { id },
        data: { approvedStatus: isApproved },
      });
    } else {
      return res.status(400).json({ error: "Approval date is required" });
    }
    res.status(200).json(updatedStamp);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the approval date" });
  }
};
export const updateSubstituteName = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const { substituteName } = req.body;

    if (!substituteName) {
      return res.status(400).json({ error: "Substitute name is required" });
    }

    const updatedStamp = await prisma.stamp.update({
      where: { id },
      data: { substituteName },
    });

    res.status(200).json(updatedStamp);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the substitute name" });
  }
};
