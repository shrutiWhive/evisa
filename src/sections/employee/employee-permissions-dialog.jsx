import { useState, useEffect } from "react";
import { useBoolean } from "minimal-shared/hooks";

import {
  Dialog,
  Stack,
  Typography,
  Button,
  Box,
  IconButton,
  Collapse,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchSelectedEmployeePermissionsRequest } from "src/redux/actions";
import { selectPermissionState } from "src/redux/selectors";

import { Iconify } from "src/components/iconify";
import { toast } from "src/components/snackbar";

import { updateSelectedEmployeePermissions } from "src/api";

const getAllChildIds = (node) => {
  let ids = [];
  if (node.children?.length > 0) {
    node.children.forEach((child) => {
      ids.push(child.id);
      ids = ids.concat(getAllChildIds(child));
    });
  }
  return ids;
};

const findParent = (nodes, childId, parent = null) => {
  let result = null;

  nodes.forEach((node) => {
    if (result) return;

    if (node.id === childId) {
      result = parent;
      return;
    }

    if (node.children?.length) {
      const found = findParent(node.children, childId, node);
      if (found) result = found;
    }
  });

  return result;
};

export function EmployeePermissionsDialog({ open, onClose, employee }) {
  const { id: employeeId, name: employeeName } = employee;

  const dispatch = useAppDispatch();

  const [checkedPermissions, setCheckedPermissions] = useState({});

  const { allPermissions, selectedEmployeePermissions } = useAppSelector(
    selectPermissionState
  );

  useEffect(() => {
    function getPermissionListIds(permissions) {
      const acc = {};

      function traverse(per) {
        per.forEach((p) => {
          acc[p.id] = true;
          if (Array.isArray(p.children) && p.children.length > 0) {
            traverse(p.children);
          }
        });
      }

      traverse(permissions);

      return acc;
    }

    const employeePermissionIds = getPermissionListIds(
      selectedEmployeePermissions
    );

    setCheckedPermissions(employeePermissionIds);
  }, [selectedEmployeePermissions]);

  useEffect(() => {
    dispatch(fetchSelectedEmployeePermissionsRequest(employeeId));
  }, [dispatch, employeeId]);

  const handleUpdatePermissions = async () => {
    try {
      const data = {
        user_id: employeeId,
        menu_id: Object.keys(checkedPermissions)
          .filter((key) => checkedPermissions[key])
          .map((key) => Number(key)),
      };

      console.log("thisis data", data);
      await updateSelectedEmployeePermissions(data);

      onClose();

      toast.success("Permissions updated successfully!");
    } catch (error) {
      console.error(error);

      toast.error("Couldn't update permissions. Please try again.");
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack>
          <Typography variant="h6">
            {employeeName}&apos;s permissions
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Manage access levels and permissions for employees in your
            organization.
          </Typography>
        </Stack>

        <Stack spacing={0.5}>
          {allPermissions.map((permission) => (
            <PermissionItem
              key={permission.id}
              //
              permission={permission}
              depth={0}
              //
              checkedPermissions={checkedPermissions}
              setCheckedPermissions={setCheckedPermissions}
              allPermissions={allPermissions}
            />
          ))}
        </Stack>

        <Box sx={{ gap: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>

          <Button variant="contained" onClick={handleUpdatePermissions}>
            Update
          </Button>
        </Box>
      </Stack>
    </Dialog>
  );
}

function PermissionItem({
  permission,
  depth = 0,
  checkedPermissions,
  setCheckedPermissions,
  allPermissions,
}) {
  const open = useBoolean();

  const isChecked = !!checkedPermissions[permission.id];

  const hasChildren = permission.children?.length > 0;

  const toggleChildren = (node, checked) => {
    const childIds = getAllChildIds(node);

    setCheckedPermissions((prev) => {
      const updated = { ...prev, [node.id]: checked };
      childIds.forEach((id) => {
        updated[id] = checked;
      });
      return updated;
    });
  };

  const onCheckboxChange = () => {
    const newChecked = !isChecked;

    if (hasChildren) {
      toggleChildren(permission, newChecked);
    } else {
      setCheckedPermissions((prev) => ({
        ...prev,
        [permission.id]: newChecked,
      }));

      if (newChecked) {
        const parentsToCheck = [];
        let parent = findParent(allPermissions, permission.id);

        while (parent) {
          parentsToCheck.push(parent.id);
          parent = findParent(allPermissions, parent.id);
        }

        setCheckedPermissions((prev) => {
          const updated = { ...prev };

          parentsToCheck.forEach((id) => {
            updated[id] = true;
          });

          return updated;
        });
      } else {
        const uncheckParentsIfNeeded = (nodeId, checkedMap) => {
          const parent = findParent(allPermissions, nodeId);
          if (!parent) return;

          const siblings = parent.children || [];
          const allSiblingsUnchecked = siblings.every(
            (child) => !checkedMap[child.id]
          );

          if (allSiblingsUnchecked) {
            checkedMap[parent.id] = false;

            uncheckParentsIfNeeded(parent.id, checkedMap);
          }
        };

        setCheckedPermissions((prev) => {
          const updated = { ...prev, [permission.id]: false };
          uncheckParentsIfNeeded(permission.id, updated);
          return updated;
        });
      }
    }
  };

  return (
    <Stack spacing={1} sx={{ ml: depth * 2 }}>
      <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
        <FormControlLabel
          control={<Checkbox checked={isChecked} onChange={onCheckboxChange} />}
          label={permission.menu_name}
        />

        {hasChildren && (
          <IconButton onClick={open.onToggle}>
            <Iconify
              icon={open.value ? "mingcute:up-fill" : "mingcute:down-fill"}
              width={18}
            />
          </IconButton>
        )}
      </Box>

      {hasChildren && (
        <Collapse in={open.value} timeout="auto" unmountOnExit>
          <Stack spacing={1}>
            {permission.children.map((child) => (
              <PermissionItem
                key={child.id}
                //
                permission={child}
                depth={depth + 1}
                //
                checkedPermissions={checkedPermissions}
                setCheckedPermissions={setCheckedPermissions}
                allPermissions={allPermissions}
              />
            ))}
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
}
