import Box from "@mui/material/Box";
import { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import { Category, TodoAddInterface, Status, StatusGetProps } from "..//../App";

interface FormElements extends HTMLFormControlsCollection {
  todoInput: HTMLInputElement;
}

interface UserFormElements extends HTMLFormElement {
  readonly elements: FormElements;
}

interface TodoProps {
  onSubmit: (todo: TodoAddInterface) => void;
  categoryList: Category[];
  onCategoryChange: ({ apiToken, categoryId }: StatusGetProps) => any;
}

function Todo({ onSubmit, categoryList, onCategoryChange }: TodoProps) {
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
    const todoText = event.currentTarget.elements.todoInput;

    onSubmit({
      title: todoText.value,
      categoryId: parseInt(categorySelect),
      statusId: parseInt(statusSelect),
    });

    todoText.value = "";
    setCategorySelect("");
    setStatusSelect("");
  }

  return (
    <Box component="div" sx={{ width: "100%", mb: 10 }}>
      <Typography variant="h2" gutterBottom component="h1">
        Todo Ekle
      </Typography>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          sx={{ width: "33ch", m: 1 }}
          id="todoInput"
          name="todoInput"
          label="Todo Metni"
          placeholder="Todo Metni"
          required
        />
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
        <br />
        <Button sx={{ ml: 1, mr: 1 }} type="submit" variant="contained">
          Ekle
        </Button>
      </form>
    </Box>
  );
}

export default Todo;
