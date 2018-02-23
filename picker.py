#!/usr/bin/env python3

import random
import sys

file = "/Users/elvisrossi/Desktop/films.txt"

lines = open(file).read().splitlines()

holder = []
x = 0

while x < 4:
	myline = random.choice(lines)
	if myline in holder:
		pass
	else:
		holder.append(myline)
		x += 1

sys.exit(len(holder))