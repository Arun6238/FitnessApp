for i in range(1, 13):   # loop for each row of the pyramid
    for j in range(1, 24):  # loop for each column of the pyramid
        if j >= (12 - i) and j <= (12 + i):  # check if the current column is within the pyramid's base
            print("#", end='')  # print hash symbol
        else:
            print(" ", end='')  # print space
    print()  # move to the next row
