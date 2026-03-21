"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getNetworkData } from "@/services/api";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d"),
  { ssr: false }
);

export default function NetworkPage() {
  const [data, setData] = useState(null);
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    getNetworkData().then((res) => {
      setData(res);

      // 🔥 Convert to graph format
      const nodes = res.nodes.map((n) => ({ id: n }));

      const links = res.edges.map((e) => ({
        source: e.source,
        target: e.target,
      }));

      setGraphData({ nodes, links });
    });
  }, []);

  if (!data)
    return (
      <div className="min-h-screen bg-[#070c18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
          <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
            Loading
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#070c18]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/70 font-semibold mb-1">
            Graph
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Network Visualization
          </h1>
        </div>

        {/* 🔥 Graph Visualization */}
        {graphData && (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl mb-10 overflow-hidden">
            <ForceGraph2D
              graphData={graphData}
              nodeAutoColorBy="id"
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.005}
              nodeLabel="id"
              height={400}
            />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-6 py-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-2">
              Total Nodes
            </p>
            <p className="text-3xl font-bold text-white">
              {data.nodes.length}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-6 py-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-2">
              Connections
            </p>
            <p className="text-3xl font-bold text-white">
              {data.edges.length}
            </p>
          </div>
        </div>

        {/* Node List */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">

          <div className="px-6 py-4 border-b border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Network Nodes
            </p>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {data.nodes.map((node, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03]"
              >
                <span className="text-xs text-slate-500 w-6">
                  {i + 1}
                </span>

                <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <span className="text-xs text-cyan-400">
                    {node[0]}
                  </span>
                </div>

                <p className="text-sm text-slate-300">
                  {node}
                </p>
              </div>
            ))}
          </div>

        </div>

      </main>
    </div>
  );
}