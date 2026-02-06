"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMemo, useRef } from "react";
import { useVisualizerStore } from "~/libs/visualizer/store";

function LinkedListNode({
  node,
  isHighlighted,
  isDeleting,
}: {
  node: { id: string; value: number | string; nextId: string | null };
  isHighlighted: boolean;
  isDeleting: boolean;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(nodeRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
  }, []);

  useGSAP(() => {
    const targetBg = isHighlighted ? "#f5f5f5" : "white";
    const targetBorder = isHighlighted ? "#a3a3a3" : "#e5e5e5";

    gsap.to(contentRef.current, {
      backgroundColor: targetBg,
      borderColor: targetBorder,
      duration: 0.2,
    });

    if (isDeleting) {
      gsap.to(nodeRef.current, { opacity: 0.3, duration: 0.2 });
    } else {
      gsap.to(nodeRef.current, { opacity: 1, duration: 0.2 });
    }
  }, [isHighlighted, isDeleting]);

  return (
    <div ref={nodeRef} className="flex items-center">
      <div
        ref={contentRef}
        className="w-12 h-12 border flex items-center justify-center font-mono text-sm"
        style={{
          backgroundColor: "white",
          borderColor: "#e5e5e5",
        }}
      >
        {node.value}
      </div>

      {node.nextId ? (
        <div className="w-6 h-[1px] bg-neutral-300" />
      ) : (
        <span className="ml-3 text-[10px] text-neutral-400 font-mono">null</span>
      )}
    </div>
  );
}

export function LinkedListCanvas() {
  const { linkedList, steps, currentStepIndex } = useVisualizerStore();

  const orderedList = useMemo(() => {
    if (linkedList.length === 0) return [];
    return linkedList;
  }, [linkedList]);

  const step = steps[currentStepIndex > -1 ? currentStepIndex : steps.length - 1];

  if (orderedList.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-sm text-neutral-400">Empty list</p>
          <p className="text-xs text-neutral-300 mt-1">Enter a value and click Append</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-start p-8 overflow-x-auto bg-neutral-50">
      <div className="flex gap-1 items-center min-w-max">
        <span className="text-[10px] text-neutral-400 uppercase tracking-wider mr-3">Head</span>

        {orderedList.map((node) => {
          const isHighlighted = step?.nodeId === node.id || step?.targetId === node.id;
          const isDeleting = step?.type === "delete" && step?.nodeId === node.id;

          return (
            <LinkedListNode
              key={node.id}
              node={node}
              isHighlighted={isHighlighted}
              isDeleting={isDeleting}
            />
          );
        })}
      </div>
    </div>
  );
}
