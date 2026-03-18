import { useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { AccountRow } from "@/components/account-row";
import type { TwoFactorAccount, Workspace } from "@/lib/get2fa-data";

interface AccountSortableListProps {
  accounts: TwoFactorAccount[];
  visibleAccounts: TwoFactorAccount[];
  availableTags: string[];
  currentWorkspaceId: string;
  isSortable?: boolean;
  onRemove: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onUpdate: (account: TwoFactorAccount, destinationWorkspaceId?: string) => void;
  workspaces: Workspace[];
}

function mergeVisibleIdsIntoAccountOrder(
  accountIds: string[],
  visibleAccountIds: string[],
  reorderedVisibleIds: string[],
) {
  const visibleSet = new Set(visibleAccountIds);
  let visibleIndex = 0;

  return accountIds.map((accountId) =>
    visibleSet.has(accountId) ? reorderedVisibleIds[visibleIndex++] : accountId,
  );
}

interface SortableAccountItemProps {
  account: TwoFactorAccount;
  availableTags: string[];
  currentWorkspaceId: string;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (account: TwoFactorAccount, destinationWorkspaceId?: string) => void;
  workspaces: Workspace[];
}

function SortableAccountItem({
  account,
  availableTags,
  currentWorkspaceId,
  index,
  onRemove,
  onUpdate,
  workspaces,
}: SortableAccountItemProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: account.id });

  return (
    <div
      data-sortable-index={index}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <AccountRow
        account={account}
        availableTags={availableTags}
        currentWorkspaceId={currentWorkspaceId}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
        dragHandleRef={setActivatorNodeRef}
        isDragging={isDragging}
        isDraggable
        onRemove={onRemove}
        onUpdate={onUpdate}
        workspaces={workspaces}
      />
    </div>
  );
}

export function AccountSortableList({
  accounts,
  visibleAccounts,
  availableTags,
  currentWorkspaceId,
  isSortable = true,
  onRemove,
  onReorder,
  onUpdate,
  workspaces,
}: AccountSortableListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const visibleAccountIds = useMemo(
    () => visibleAccounts.map((account) => account.id),
    [visibleAccounts],
  );
  const activeAccount =
    visibleAccounts.find((account) => account.id === activeId) ??
    accounts.find((account) => account.id === activeId) ??
    null;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = visibleAccountIds.indexOf(String(active.id));
    const newIndex = visibleAccountIds.indexOf(String(over.id));

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const reorderedVisibleIds = arrayMove(visibleAccountIds, oldIndex, newIndex);
    const nextIds =
      visibleAccountIds.length === accounts.length
        ? reorderedVisibleIds
        : mergeVisibleIdsIntoAccountOrder(
            accounts.map((account) => account.id),
            visibleAccountIds,
            reorderedVisibleIds,
          );

    onReorder(nextIds);
  };

  if (!isSortable) {
    return (
      <div className="space-y-3">
        {visibleAccounts.map((account, index) => (
          <div data-sortable-index={index} key={account.id}>
            <AccountRow
              account={account}
              availableTags={availableTags}
              currentWorkspaceId={currentWorkspaceId}
              onRemove={onRemove}
              onUpdate={onUpdate}
              workspaces={workspaces}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext items={visibleAccountIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {visibleAccounts.map((account) => (
            <SortableAccountItem
              key={account.id}
              account={account}
              availableTags={availableTags}
              currentWorkspaceId={currentWorkspaceId}
              index={visibleAccounts.indexOf(account)}
              onRemove={onRemove}
              onUpdate={onUpdate}
              workspaces={workspaces}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeAccount ? (
          <div className="rotate-[0.5deg] scale-[1.01]">
            <AccountRow
              account={activeAccount}
              availableTags={availableTags}
              currentWorkspaceId={currentWorkspaceId}
              isDragging
              onRemove={onRemove}
              onUpdate={onUpdate}
              workspaces={workspaces}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
