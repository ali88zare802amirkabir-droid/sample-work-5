import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, FolderKanban, MessageSquare } from "lucide-react";
import { projects, projectActivity, projectChats, projectDocs } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { DemoNote } from "@/components/dashboard/widgets";
import ProjectTabs from "./project-tabs";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const chats = projectChats[id] ?? [];
  const docs = projectDocs[id] ?? [];
  const activity = projectActivity[id] ?? [];

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 px-4 py-6 sm:px-6">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-3 transition-colors hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to projects
      </Link>

      <div className="card p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${project.from}, ${project.to})` }}
            >
              <FolderKanban className="h-5 w-5" />
            </span>
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <Badge tone={project.status === "Active" ? "accent" : project.status === "Paused" ? "warn" : "ok"}>{project.status}</Badge>
                <DemoNote />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-ink">{project.name}</h1>
              <p className="mt-1 max-w-xl text-sm text-ink-3">{project.desc}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-[12px] text-ink-3">
            <span className="inline-flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> {project.conversations} conversations</span>
            <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> {project.documents} documents</span>
            <span className="mt-1 rounded-full border border-edge px-2.5 py-1 font-medium">{project.progress}% complete</span>
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${project.progress}%`, background: `linear-gradient(90deg, ${project.from}, ${project.to})` }}
          />
        </div>
      </div>

      <ProjectTabs projectId={id} chats={chats} docs={docs} activity={activity} />
    </div>
  );
}