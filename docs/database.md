# Database Schema

The complete schema is defined in `prisma/schema.prisma` and includes:
- Identity and access: `User`, `Profile`, `Role`, `Permission`, `UserRole`, `RolePermission`, `Session`
- Core reading domain: `Reading`, `ReadingImage`, `ReadingResult`, `ReadingSection`, `PromptTemplate`
- Monetization: `Plan`, `Subscription`, `Payment`, `Invoice`, `Coupon`, `Referral`
- Growth/support/content: `Notification`, `SupportTicket`, `BlogPost`, `Testimonial`, `Setting`, `AuditLog`

Every table includes timestamps and key indexes; soft-delete fields exist on selected high-value entities.
