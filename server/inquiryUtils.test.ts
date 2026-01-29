import { describe, expect, it } from "vitest";
import { generateInquiryNumber, validateInquiryNumber } from "./inquiryUtils";

describe("Inquiry Utils", () => {
  describe("generateInquiryNumber", () => {
    it("should generate inquiry number in correct format", () => {
      const inquiryNumber = generateInquiryNumber();
      expect(inquiryNumber).toMatch(/^INQ-\d{8}-\d{3}$/);
    });

    it("should generate unique inquiry numbers", () => {
      const numbers = new Set();
      for (let i = 0; i < 100; i++) {
        numbers.add(generateInquiryNumber());
      }
      // Should have at least 90% unique numbers (accounting for random collisions)
      expect(numbers.size).toBeGreaterThan(90);
    });

    it("should include current date in inquiry number", () => {
      const inquiryNumber = generateInquiryNumber();
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const expectedDatePart = `${year}${month}${day}`;
      
      expect(inquiryNumber).toContain(expectedDatePart);
    });
  });

  describe("validateInquiryNumber", () => {
    it("should validate correct inquiry number format", () => {
      expect(validateInquiryNumber("INQ-20260128-001")).toBe(true);
      expect(validateInquiryNumber("INQ-20260128-999")).toBe(true);
    });

    it("should reject invalid inquiry number formats", () => {
      expect(validateInquiryNumber("INQ-2026012-001")).toBe(false); // Wrong date length
      expect(validateInquiryNumber("INQ-20260128-01")).toBe(false); // Wrong sequence length
      expect(validateInquiryNumber("INQ-20260128-1234")).toBe(false); // Too long sequence
      expect(validateInquiryNumber("INVALID-20260128-001")).toBe(false); // Wrong prefix
      expect(validateInquiryNumber("INQ20260128001")).toBe(false); // Missing separators
      expect(validateInquiryNumber("")).toBe(false); // Empty string
    });
  });
});
