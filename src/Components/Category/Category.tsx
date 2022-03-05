
import React from 'react';


import {
	Box,
	Typography,
	Button,
	List,
	ListItem,
	TextField,
}   from '@mui/material';


import {
	Category,
	CategoryAddProps,
	CategoryUpdateProps,
	CategoryDeleteProps,
} from '../App';

interface CategoryPageProps {
	categoriesList: Category[];
	onNewCategorySubmit: ({ apiToken, title }: CategoryAddProps) => void;
	onUpdateCategorySubmit: ({
		apiToken,
		id,
		title,
	}: CategoryUpdateProps) => void;
	onDeleteCategorySubmit: ({ apiToken, id }: CategoryDeleteProps) => void;
	onStatusEdit: any;
}


interface FormElements extends HTMLFormControlsCollection {
	newCategoryInput: HTMLInputElement;
	categoryInput: HTMLInputElement;
}

interface UserFormElements extends HTMLFormElement {
	readonly elements: FormElements;
}

function CategoryPage({
	categoriesList,
	onNewCategorySubmit,
	onUpdateCategorySubmit,
	onDeleteCategorySubmit,
	onStatusEdit,
}: CategoryPageProps) {
	
	function handleNewCategorySubmit(event: React.FormEvent<UserFormElements>) {
	
		event.preventDefault();

	
		const newCategoryTitle = event.currentTarget.elements.newCategoryInput;

	
		onNewCategorySubmit({ title: newCategoryTitle.value });

	
		newCategoryTitle.value = '';
	}

	function handleCategoryUpdateSubmit(
		event: React.FormEvent<UserFormElements>
	) {
		
		event.preventDefault();

		
		const updatedCategoryId = parseInt(
			event.currentTarget.elements.categoryInput.id
		);
		const updatedCategoryTitle =
			event.currentTarget.elements.categoryInput.value;

		
		onUpdateCategorySubmit({
			id: updatedCategoryId,
			title: updatedCategoryTitle,
		});
	}

	function handleDeleteCategorySubmit(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		categoryId: number
	) {
	
		event.stopPropagation();

		
		onDeleteCategorySubmit({
			id: categoryId,
		});
	}

	return (
		<Box
			sx={{
				maxWidth: '100%',
				width: '100%',
				p: 2,
				boxSizing: 'border-box',
			}}
		>
			
			<Typography variant="h1" component="h1" gutterBottom>
				Kategorileri Duzenle
			</Typography>
			<Box component="div" sx={{ width: '100%', mb: 10 }}>
				<Typography variant="h2" gutterBottom component="h1">
					Kategori Ekle
				</Typography>

				<Box
					component="form"
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'center',
						width: '100%',
						mb: 10,
					}}
					autoComplete="off"
					onSubmit={(event: any) => handleNewCategorySubmit(event)}
				>
					<TextField
						sx={{ width: '33ch', m: 1 }}
						id="newCategoryInput"
						name="newCategoryInput"
						label="Yeni Kategori Adi"
						placeholder="Yeni Kategori Adi"
						required
					/>
					<Button sx={{ ml: 1, mr: 1 }} type="submit" variant="contained">
						Kategori Ekle
					</Button>
				</Box>
			</Box>

			<Box component="div" sx={{ width: '100%', mb: 10 }}>
				<Typography variant="h2" component="h2" gutterBottom>
					Kategorileri Listesi
				</Typography>

				<List sx={{ width: '100%', maxWidth: 800 }}>
					{categoriesList.map((category) => (
						<ListItem key={category.id}>
							<Box
								component="form"
								sx={{
									display: 'flex',
									flexWrap: 'wrap',
									alignItems: 'center',
									width: '100%',
									mb: 2,
								}}
								autoComplete="off"
								onSubmit={(event: any) => handleCategoryUpdateSubmit(event)}
							>
								<TextField
									sx={{ width: '33ch', mr: 5 }}
									id={category.id.toString()}
									name="categoryInput"
									label="Kategori Adi"
									placeholder="Kategori Adi"
									variant="standard"
									required
									defaultValue={category.title}
								/>

								<Button type="submit" variant="contained" sx={{ mr: 1 }}>
									Guncelle
								</Button>
								<Button
									type="button"
									sx={{ mr: 1 }}
									variant="contained"
									color="secondary"
									onClick={() => onStatusEdit(category)}
								>
									Statuler Duzenle
								</Button>
								<Button
									type="button"
									variant="outlined"
									onClick={(event:any) =>
										handleDeleteCategorySubmit(event, category.id)
									}
								>
									Sil
								</Button>
							</Box>
						</ListItem>
					))}
				</List>
			</Box>
		</Box>
	);
}

export default CategoryPage;
