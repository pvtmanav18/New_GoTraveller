"use client";

import React from "react";

interface MarkdownFormatterProps {
  content: string;
}

export default function MarkdownFormatter({ content }: MarkdownFormatterProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  
  let currentList: React.ReactNode[] = [];
  let inList = false;
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc list-inside pl-4 space-y-1.5 my-3 text-slate-355 font-sans text-xs leading-relaxed">
          {currentList}
        </ul>
      );
      currentList = [];
    }
    inList = false;
  };

  const flushTable = (key: string) => {
    if (inTable) {
      elements.push(
        <div key={`table-wrapper-${key}`} className="overflow-x-auto my-4 rounded-xl border border-slate-800 bg-slate-950/20 max-w-full">
          <table className="min-w-full divide-y divide-slate-800 text-left text-xs text-slate-300">
            {tableHeaders.length > 0 && (
              <thead className="bg-[#0b1120]/60 font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  {tableHeaders.map((h, i) => (
                    <th key={i} className="px-4 py-3 border-b border-slate-800 font-sans">{h}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-850 bg-[#050810]/20 font-sans">
              {tableRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/10 transition-colors">
                  {row.map((cell, i) => (
                    <td key={i} className="px-4 py-3 select-text">{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeaders = [];
      tableRows = [];
      inTable = false;
    }
  };

  function renderInline(text: string): React.ReactNode {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-slate-100 font-sans">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Table Handling
    if (line.startsWith("|")) {
      flushList(`table-flush-${i}`);
      inTable = true;
      const cells = line
        .split("|")
        .map((c) => c.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

      // Skip divider separator row like |---|---|
      if (cells.every((c) => c.startsWith("-"))) {
        continue;
      }

      if (tableHeaders.length === 0 && tableRows.length === 0) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      flushTable(`table-flush-${i}`);
    }

    // List Handling
    if (line.startsWith("* ") || line.startsWith("- ") || line.startsWith("+ ") || line.startsWith("• ")) {
      inList = true;
      const listContent = line.replace(/^([*\-+•]\s*)/, "");
      currentList.push(
        <li key={`li-${i}-${listContent.substring(0, 10)}`} className="text-slate-350 leading-relaxed">
          {renderInline(listContent)}
        </li>
      );
      continue;
    } else if (line.startsWith("\t") || line.startsWith("  ")) {
      // Sub-bullets
      if (inList) {
        const nestedContent = line.trim().replace(/^([*\-+•]\s*)/, "");
        currentList.push(
          <li key={`li-nested-${i}`} className="pl-5 list-circle text-slate-400 mt-1">
            {renderInline(nestedContent)}
          </li>
        );
        continue;
      }
    } else {
      flushList(`list-flush-${i}`);
    }

    // Empty Lines
    if (!line) {
      elements.push(<div key={`empty-${i}`} className="h-2" />);
      continue;
    }

    // Headers (clean double-markups like "## # Header")
    let cleanedLine = line;
    if (cleanedLine.startsWith("## # ")) {
      cleanedLine = "## " + cleanedLine.substring(5);
    } else if (cleanedLine.startsWith("# # ")) {
      cleanedLine = "# " + cleanedLine.substring(4);
    }

    if (cleanedLine.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="font-serif text-lg font-bold text-yellow-400 border-b border-slate-850 pb-2 mt-6 mb-3 tracking-tight">
          {renderInline(cleanedLine.substring(2))}
        </h1>
      );
    } else if (cleanedLine.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="font-serif text-base font-bold text-slate-100 mt-5 mb-2.5 tracking-tight">
          {renderInline(cleanedLine.substring(3))}
        </h2>
      );
    } else if (cleanedLine.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="font-sans text-sm font-bold text-slate-200 mt-4 mb-2">
          {renderInline(cleanedLine.substring(4))}
        </h3>
      );
    } else {
      // Paragraph
      elements.push(
        <p key={`p-${i}`} className="font-sans text-xs text-slate-350 leading-relaxed mb-2.5 select-text">
          {renderInline(cleanedLine)}
        </p>
      );
    }
  }

  // Flush remaining lists/tables at EOF
  flushList("eof");
  flushTable("eof");

  return <div className="space-y-1 max-w-full">{elements}</div>;
}
