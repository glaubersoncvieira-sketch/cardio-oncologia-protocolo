CREATE TABLE `drug_updates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`drugName` varchar(200) NOT NULL,
	`updateType` varchar(50) NOT NULL,
	`source` varchar(100) NOT NULL,
	`sourceUrl` text,
	`title` varchar(500) NOT NULL,
	`description` text NOT NULL,
	`clinicalRelevance` varchar(20) DEFAULT 'moderada',
	`applied` boolean DEFAULT false,
	`appliedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `drug_updates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `update_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobType` varchar(50) NOT NULL,
	`status` varchar(30) NOT NULL DEFAULT 'running',
	`sourcesChecked` text,
	`drugsFound` int DEFAULT 0,
	`drugsUpdated` int DEFAULT 0,
	`alertsFound` int DEFAULT 0,
	`githubCommit` varchar(100),
	`errorMessage` text,
	`summary` text,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `update_jobs_id` PRIMARY KEY(`id`)
);
