S = input("enter a string :")

lower = ""
upper = ""
oddDigits = ""
evenDigits = ""

for i in S:
    if i.isalpha():
        if i.islower():
            lower +=i
        else:
            upper +=i
    elif i.isdigit():
        if int(i)%2 == 0:
            evenDigits +=i
        else:
            oddDigits +=i
            
lower = "".join(sorted(lower))
upper = "".join(sorted(upper))
oddDigits = "".join(sorted(oddDigits))
evenDigits = "".join(sorted(evenDigits))

print(lower + upper + oddDigits + evenDigits)