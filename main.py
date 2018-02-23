import improved_picker as imppi

if __name__ == "__main__":
	file = "imdone.xml"

	test = imppi.delegato(file)
	print(test.add_film('Requiem for a dream'))