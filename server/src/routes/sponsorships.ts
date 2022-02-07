import { Response, Router } from "express";
import { Request } from "../utils/Request";
import { logger } from "../utils/logger";
import { auth } from "../middleware/auth";
import { validateRequest } from "jack-hermanson-ts-utils";
import { authorized, parseNumber } from "../utils/functions";
import { SponsorshipService } from "../services/SponsorshipService";
import {
    Clearance,
    SponsorshipRequest,
    SponsorshipRecord,
} from "@nica-angels/shared";
import { sponsorshipSchema } from "../models/Sponsorship";

export const router = Router();
