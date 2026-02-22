import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ProjectsModule } from './projects/projects.module';
import { DirectoryModule } from './directory/directory.module';
import { RfisModule } from './rfis/rfis.module';
import { SubmittalsModule } from './submittals/submittals.module';
import { DailyLogsModule } from './daily-logs/daily-logs.module';
import { DrawingsModule } from './drawings/drawings.module';
import { FinancialModule } from './financial/financial.module';
import { DocumentsModule } from './documents/documents.module';
import { PrismaModule } from './common/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ProjectsModule,
    DirectoryModule,
    RfisModule,
    SubmittalsModule,
    DailyLogsModule,
    DrawingsModule,
    FinancialModule,
    DocumentsModule,
  ],
})
export class AppModule {}
