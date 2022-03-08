import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Typography,
  MenuItem,
} from "@mui/material";

import { Category, TodoAddInterface, Status, StatusGetProps } from "..//..//App";

interface FormElements extends HTMLFormControlsCollection {
  todoInput: HTMLInputElement;
}

interface UserFormElements extends HTMLFormElement {
  readonly elements: FormElements;
}

interface TodoProps {
  onSubmit: (action: boolean, categoryId?: number, statusId?: number) => void;
  categoryList: Category[];
  onCategoryChange: ({ apiToken, categoryId }: StatusGetProps) => any;
}

function Filter({ onSubmit, categoryList, onCategoryChange }: TodoProps) {
  const [categorySelect, setCategorySelect] = useState<string>("");
  const [statusSelect, setStatusSelect] = useState<string>("");
  const [statusList, setStatusList] = useState<Status[]>([]);

  async function handleCategorySelectChange(event: SelectChangeEvent) {
    setCategorySelect(event.target.value as string);

    const receivedStatus = await onCategoryChange({
      categoryId: parseInt(event.target.value),
    });

    setStatusList(receivedStatus);
  }

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusSelect(event.target.value as string);
  };

  function handleSubmit(event: React.FormEvent<UserFormElements>): void {
    event.preventDefault();

    onSubmit(true, parseInt(categorySelect), parseInt(statusSelect));
  }

  function handleClear(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.stopPropagation();

    onSubmit(false);

    setCategorySelect("");
    setStatusSelect("");
  }

  return (
    <Box component="div" sx={{ width: "100%", mt: 10, mb: 10 }}>
      <Typography variant="h2" gutterBottom component="h1">
        Filtrele (CALISMIYOR)
      </Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          width: "100%",
          mb: 2,
        }}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <FormControl required sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Kategori</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="categorySelect"
            value={categorySelect}
            label="Kategori Sec"
            onChange={handleCategorySelectChange}
          >
            {categoryList &&
              categoryList.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.title}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl required sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Statu</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="statuSelect"
            value={statusSelect}
            label="Statu Sec"
            onChange={handleStatusChange}
          >
            {statusList.length &&
              statusList.map((status) => (
                <MenuItem key={status.id} value={status.id.toString()}>
                  {status.title}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button sx={{ ml: 1, mr: 1 }} type="submit" variant="contained">
          Filtrele
        </Button>
        <Button
          sx={{ ml: 1, mr: 1 }}
          type="button"
          variant="contained"
          onClick={handleClear}
        >
          Filtreyi Sil
        </Button>
      </Box>
    </Box>
  );
}

export default Filter;
