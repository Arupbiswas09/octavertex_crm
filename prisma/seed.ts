import { PrismaClient, Role, UserStatus, ProjectStatus, TaskStatus, Priority, ChannelType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create Organization
    const org = await prisma.organization.upsert({
        where: { slug: 'octavertex-media' },
        update: {},
        create: {
            name: 'Octavertex Media',
            slug: 'octavertex-media',
            description: 'A leading digital media and technology company',
            logo: '/logo.png',
            settings: {
                timezone: 'America/Los_Angeles',
                workingHours: { start: '09:00', end: '18:00' },
                workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            },
        },
    });

    console.log('✅ Created organization:', org.name);

    // Create Departments
    const departments = await Promise.all([
        prisma.department.upsert({
            where: { id: 'dept-engineering' },
            update: {},
            create: { id: 'dept-engineering', name: 'Engineering', description: 'Software development team', organizationId: org.id },
        }),
        prisma.department.upsert({
            where: { id: 'dept-design' },
            update: {},
            create: { id: 'dept-design', name: 'Design', description: 'UI/UX and creative team', organizationId: org.id },
        }),
        prisma.department.upsert({
            where: { id: 'dept-marketing' },
            update: {},
            create: { id: 'dept-marketing', name: 'Marketing', description: 'Marketing and growth team', organizationId: org.id },
        }),
        prisma.department.upsert({
            where: { id: 'dept-hr' },
            update: {},
            create: { id: 'dept-hr', name: 'Human Resources', description: 'HR and operations', organizationId: org.id },
        }),
    ]);

    console.log('✅ Created departments:', departments.length);

    // Create Teams
    const teams = await Promise.all([
        prisma.team.upsert({
            where: { id: 'team-web' },
            update: {},
            create: { id: 'team-web', name: 'Web Platform', description: 'Web application development', departmentId: 'dept-engineering', organizationId: org.id },
        }),
        prisma.team.upsert({
            where: { id: 'team-mobile' },
            update: {},
            create: { id: 'team-mobile', name: 'Mobile', description: 'iOS and Android development', departmentId: 'dept-engineering', organizationId: org.id },
        }),
        prisma.team.upsert({
            where: { id: 'team-product' },
            update: {},
            create: { id: 'team-product', name: 'Product Design', description: 'Product design and UX', departmentId: 'dept-design', organizationId: org.id },
        }),
    ]);

    console.log('✅ Created teams:', teams.length);

    // Create Leave Types
    const leaveTypes = await Promise.all([
        prisma.leaveType.upsert({
            where: { id: 'leave-casual' },
            update: {},
            create: { id: 'leave-casual', name: 'Casual Leave', description: 'General time off', defaultDays: 12, carryForward: true, maxCarryForward: 3, organizationId: org.id },
        }),
        prisma.leaveType.upsert({
            where: { id: 'leave-sick' },
            update: {},
            create: { id: 'leave-sick', name: 'Sick Leave', description: 'Medical leave', defaultDays: 12, carryForward: false, organizationId: org.id },
        }),
        prisma.leaveType.upsert({
            where: { id: 'leave-earned' },
            update: {},
            create: { id: 'leave-earned', name: 'Earned Leave', description: 'Vacation and personal time', defaultDays: 15, carryForward: true, maxCarryForward: 5, organizationId: org.id },
        }),
        prisma.leaveType.upsert({
            where: { id: 'leave-unpaid' },
            update: {},
            create: { id: 'leave-unpaid', name: 'Unpaid Leave', description: 'Leave without pay', defaultDays: 30, carryForward: false, paid: false, organizationId: org.id },
        }),
    ]);

    console.log('✅ Created leave types:', leaveTypes.length);

    // Create Shift
    const shift = await prisma.shift.upsert({
        where: { id: 'shift-default' },
        update: {},
        create: {
            id: 'shift-default',
            name: 'Standard',
            startTime: '09:00',
            endTime: '18:00',
            breakDuration: 60,
            organizationId: org.id,
        },
    });

    console.log('✅ Created shift:', shift.name);

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123', 12);

    // Create Users
    const users = await Promise.all([
        // Super Admin
        prisma.user.upsert({
            where: { email: 'admin@octavertex.com' },
            update: {},
            create: {
                email: 'admin@octavertex.com',
                passwordHash: hashedPassword,
                firstName: 'John',
                lastName: 'Doe',
                role: Role.SUPER_ADMIN,
                status: UserStatus.ACTIVE,
                organizationId: org.id,
                departmentId: 'dept-engineering',
                shiftId: shift.id,
            },
        }),
        // Team Lead
        prisma.user.upsert({
            where: { email: 'sarah.chen@octavertex.com' },
            update: {},
            create: {
                email: 'sarah.chen@octavertex.com',
                passwordHash: hashedPassword,
                firstName: 'Sarah',
                lastName: 'Chen',
                role: Role.TEAM_LEAD,
                status: UserStatus.ACTIVE,
                organizationId: org.id,
                departmentId: 'dept-engineering',
                shiftId: shift.id,
            },
        }),
        // Employees
        prisma.user.upsert({
            where: { email: 'mike.wilson@octavertex.com' },
            update: {},
            create: {
                email: 'mike.wilson@octavertex.com',
                passwordHash: hashedPassword,
                firstName: 'Mike',
                lastName: 'Wilson',
                role: Role.EMPLOYEE,
                status: UserStatus.ACTIVE,
                organizationId: org.id,
                departmentId: 'dept-engineering',
                shiftId: shift.id,
            },
        }),
        prisma.user.upsert({
            where: { email: 'emily.brown@octavertex.com' },
            update: {},
            create: {
                email: 'emily.brown@octavertex.com',
                passwordHash: hashedPassword,
                firstName: 'Emily',
                lastName: 'Brown',
                role: Role.EMPLOYEE,
                status: UserStatus.ACTIVE,
                organizationId: org.id,
                departmentId: 'dept-design',
                shiftId: shift.id,
            },
        }),
        prisma.user.upsert({
            where: { email: 'david.lee@octavertex.com' },
            update: {},
            create: {
                email: 'david.lee@octavertex.com',
                passwordHash: hashedPassword,
                firstName: 'David',
                lastName: 'Lee',
                role: Role.EMPLOYEE,
                status: UserStatus.ACTIVE,
                organizationId: org.id,
                departmentId: 'dept-engineering',
                shiftId: shift.id,
            },
        }),
        prisma.user.upsert({
            where: { email: 'amy.zhang@octavertex.com' },
            update: {},
            create: {
                email: 'amy.zhang@octavertex.com',
                passwordHash: hashedPassword,
                firstName: 'Amy',
                lastName: 'Zhang',
                role: Role.EMPLOYEE,
                status: UserStatus.ACTIVE,
                organizationId: org.id,
                departmentId: 'dept-marketing',
                shiftId: shift.id,
            },
        }),
    ]);

    console.log('✅ Created users:', users.length);

    // Get user IDs
    const adminUser = users[0];
    const sarahUser = users[1];
    const mikeUser = users[2];
    const emilyUser = users[3];
    const davidUser = users[4];
    const amyUser = users[5];

    // Create Projects
    const projects = await Promise.all([
        prisma.project.upsert({
            where: { id: 'proj-website' },
            update: {},
            create: {
                id: 'proj-website',
                name: 'Website Redesign',
                slug: 'website-redesign',
                description: 'Complete overhaul of the company website with new branding and improved UX',
                status: ProjectStatus.ACTIVE,
                color: '#6366f1',
                icon: '🌐',
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-03-15'),
                organizationId: org.id,
                createdById: sarahUser.id,
            },
        }),
        prisma.project.upsert({
            where: { id: 'proj-mobile' },
            update: {},
            create: {
                id: 'proj-mobile',
                name: 'Mobile App v2.0',
                slug: 'mobile-app-v2',
                description: 'Major update to the mobile app with new features and performance improvements',
                status: ProjectStatus.ACTIVE,
                color: '#10b981',
                icon: '📱',
                startDate: new Date('2025-01-15'),
                endDate: new Date('2025-04-30'),
                organizationId: org.id,
                createdById: mikeUser.id,
            },
        }),
        prisma.project.upsert({
            where: { id: 'proj-marketing' },
            update: {},
            create: {
                id: 'proj-marketing',
                name: 'Marketing Campaign Q1',
                slug: 'marketing-q1',
                description: 'Q1 marketing initiatives including social media, email campaigns, and PR',
                status: ProjectStatus.PLANNING,
                color: '#f59e0b',
                icon: '📣',
                startDate: new Date('2025-02-01'),
                endDate: new Date('2025-03-31'),
                organizationId: org.id,
                createdById: amyUser.id,
            },
        }),
        prisma.project.upsert({
            where: { id: 'proj-api' },
            update: {},
            create: {
                id: 'proj-api',
                name: 'API Integration Hub',
                slug: 'api-integration',
                description: 'Build a centralized API integration platform for third-party services',
                status: ProjectStatus.ACTIVE,
                color: '#ec4899',
                icon: '🔌',
                startDate: new Date('2024-12-01'),
                endDate: new Date('2025-02-15'),
                organizationId: org.id,
                createdById: davidUser.id,
            },
        }),
    ]);

    console.log('✅ Created projects:', projects.length);

    // Create Labels (per project)
    const websiteProject = projects[0];
    const mobileProject = projects[1];
    const apiProject = projects[3];

    const labels = await Promise.all([
        prisma.label.upsert({ where: { id: 'label-bug' }, update: {}, create: { id: 'label-bug', name: 'Bug', color: '#ef4444', projectId: websiteProject.id } }),
        prisma.label.upsert({ where: { id: 'label-feature' }, update: {}, create: { id: 'label-feature', name: 'Feature', color: '#10b981', projectId: websiteProject.id } }),
        prisma.label.upsert({ where: { id: 'label-design' }, update: {}, create: { id: 'label-design', name: 'Design', color: '#ec4899', projectId: websiteProject.id } }),
        prisma.label.upsert({ where: { id: 'label-docs' }, update: {}, create: { id: 'label-docs', name: 'Documentation', color: '#f59e0b', projectId: apiProject.id } }),
        prisma.label.upsert({ where: { id: 'label-urgent' }, update: {}, create: { id: 'label-urgent', name: 'Urgent', color: '#dc2626', projectId: mobileProject.id } }),
        prisma.label.upsert({ where: { id: 'label-backend' }, update: {}, create: { id: 'label-backend', name: 'Backend', color: '#3b82f6', projectId: apiProject.id } }),
        prisma.label.upsert({ where: { id: 'label-frontend' }, update: {}, create: { id: 'label-frontend', name: 'Frontend', color: '#8b5cf6', projectId: websiteProject.id } }),
    ]);

    console.log('✅ Created labels:', labels.length);

    // Create Tasks
    const tasks = await Promise.all([
        prisma.task.create({
            data: {
                title: 'Design new landing page hero section',
                description: 'Create a compelling hero section with animated elements',
                status: TaskStatus.IN_PROGRESS,
                priority: Priority.HIGH,
                dueDate: new Date('2025-02-05'),
                projectId: 'proj-website',
                createdById: sarahUser.id,
            },
        }),
        prisma.task.create({
            data: {
                title: 'Implement user authentication flow',
                description: 'Complete OAuth2 integration with Google and GitHub',
                status: TaskStatus.TODO,
                priority: Priority.URGENT,
                dueDate: new Date('2025-02-03'),
                projectId: 'proj-mobile',
                createdById: mikeUser.id,
            },
        }),
        prisma.task.create({
            data: {
                title: 'Write API documentation',
                description: 'Document all API endpoints with examples',
                status: TaskStatus.BACKLOG,
                priority: Priority.MEDIUM,
                dueDate: new Date('2025-02-10'),
                projectId: 'proj-api',
                createdById: davidUser.id,
            },
        }),
        prisma.task.create({
            data: {
                title: 'Fix mobile navigation bug',
                description: 'Navigation menu not closing properly on mobile devices',
                status: TaskStatus.IN_REVIEW,
                priority: Priority.HIGH,
                dueDate: new Date('2025-02-01'),
                projectId: 'proj-mobile',
                createdById: mikeUser.id,
            },
        }),
        prisma.task.create({
            data: {
                title: 'Set up CI/CD pipeline',
                description: 'Configure automated testing and deployment',
                status: TaskStatus.DONE,
                priority: Priority.MEDIUM,
                dueDate: new Date('2025-01-28'),
                projectId: 'proj-api',
                createdById: davidUser.id,
            },
        }),
        prisma.task.create({
            data: {
                title: 'Create email templates',
                description: 'Design responsive email templates for marketing',
                status: TaskStatus.TODO,
                priority: Priority.LOW,
                dueDate: new Date('2025-02-15'),
                projectId: 'proj-marketing',
                createdById: amyUser.id,
            },
        }),
        prisma.task.create({
            data: {
                title: 'Performance optimization',
                description: 'Improve page load times and Core Web Vitals',
                status: TaskStatus.IN_PROGRESS,
                priority: Priority.HIGH,
                dueDate: new Date('2025-02-08'),
                projectId: 'proj-website',
                createdById: sarahUser.id,
            },
        }),
        prisma.task.create({
            data: {
                title: 'Database schema migration',
                description: 'Migrate to new normalized database schema',
                status: TaskStatus.BACKLOG,
                priority: Priority.URGENT,
                dueDate: new Date('2025-02-02'),
                projectId: 'proj-api',
                createdById: davidUser.id,
            },
        }),
    ]);

    console.log('✅ Created tasks:', tasks.length);

    // Create Chat Channels
    const channels = await Promise.all([
        prisma.channel.upsert({
            where: { id: 'channel-general' },
            update: {},
            create: {
                id: 'channel-general',
                name: 'general',
                type: ChannelType.PUBLIC,
                description: 'General discussions and announcements',
            },
        }),
        prisma.channel.upsert({
            where: { id: 'channel-engineering' },
            update: {},
            create: {
                id: 'channel-engineering',
                name: 'engineering',
                type: ChannelType.TEAM,
                description: 'Engineering team discussions',
            },
        }),
        prisma.channel.upsert({
            where: { id: 'channel-random' },
            update: {},
            create: {
                id: 'channel-random',
                name: 'random',
                type: ChannelType.PUBLIC,
                description: 'Random fun stuff',
            },
        }),
    ]);

    console.log('✅ Created chat channels:', channels.length);

    // Add channel members
    await prisma.channelMember.createMany({
        data: [
            { channelId: 'channel-general', userId: adminUser.id },
            { channelId: 'channel-general', userId: sarahUser.id },
            { channelId: 'channel-general', userId: mikeUser.id },
            { channelId: 'channel-general', userId: emilyUser.id },
            { channelId: 'channel-general', userId: davidUser.id },
            { channelId: 'channel-general', userId: amyUser.id },
            { channelId: 'channel-engineering', userId: sarahUser.id },
            { channelId: 'channel-engineering', userId: mikeUser.id },
            { channelId: 'channel-engineering', userId: davidUser.id },
            { channelId: 'channel-random', userId: adminUser.id },
            { channelId: 'channel-random', userId: sarahUser.id },
            { channelId: 'channel-random', userId: emilyUser.id },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Added channel members');

    // Create sample messages
    await prisma.chatMessage.createMany({
        data: [
            { channelId: 'channel-general', senderId: adminUser.id, content: 'Welcome to Octavertex Media! 🎉 This is our main communication channel.' },
            { channelId: 'channel-general', senderId: sarahUser.id, content: 'Excited to be here! Looking forward to working with everyone.' },
            { channelId: 'channel-general', senderId: mikeUser.id, content: 'Hey team! Just pushed the new mobile app update. Ready for testing!' },
            { channelId: 'channel-engineering', senderId: sarahUser.id, content: 'Team standup at 10:30 AM. Please prepare your updates.' },
            { channelId: 'channel-engineering', senderId: davidUser.id, content: 'Will do! I have some blockers to discuss regarding the API integration.' },
            { channelId: 'channel-random', senderId: emilyUser.id, content: 'Anyone up for lunch today? 🍕' },
        ],
    });

    console.log('✅ Created sample messages');

    // Create Leave Balances for users
    for (const user of users) {
        await Promise.all(
            leaveTypes.map((leaveType) =>
                prisma.leaveBalance.upsert({
                    where: {
                        userId_leaveTypeId_year: {
                            userId: user.id,
                            leaveTypeId: leaveType.id,
                            year: 2025,
                        },
                    },
                    update: {},
                    create: {
                        userId: user.id,
                        leaveTypeId: leaveType.id,
                        year: 2025,
                        entitled: leaveType.defaultDays,
                        used: Math.floor(Math.random() * 5),
                        pending: 0,
                    },
                })
            )
        );
    }

    console.log('✅ Created leave balances');

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 Test Credentials:');
    console.log('   Email: admin@octavertex.com');
    console.log('   Password: Admin@123');
    console.log('\n   Other users: sarah.chen@octavertex.com, mike.wilson@octavertex.com, etc.');
    console.log('   All passwords: Admin@123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
