#!/usr/bin/env python3

import random
import sys
# for xml
from xml.etree import ElementTree as ET


class delegato():
	def __init__(self, file):
		self.file = file

	def add_film(self, title):
		# first check
		# if in to_watch (exit code 1), in watched (2), else add (0)
		doc = ET.parse(self.file)
		root = doc.getroot()

		if root.findtext(str(title)) is None:
			new = ET.Element('film')
			new_name = ET.SubElement(new, 'name')
			new_name.text = str(title)
			new_watched = ET.SubElement(new, 'watched')
			new_watched.text = "False"

			root.append(new)

			doc.write('films.xml')
			return 0
		elif root.find(str(title)).find(watched).text == "True":
			return 2
		else:
			return 1
		


	def hard_remove_film(self):
		# removes from to_watch, if not successful exit code 1
		pass

	def whatched_film(self):
		# moves film from to_watch to watched
		pass

	def get_film(self, number):
		# returns a list of random films
		pass

	def list_all(self):
		# returns a list of all to_watch films
		pass