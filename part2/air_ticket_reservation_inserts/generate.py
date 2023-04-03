import re
import random
import sys

flights_unfixed = []
flights = []
customers = []
tickets = []
rates = []
airplanes = []
phone_numbers = []

with open("./flight.sql", "r") as f:
	while line := f.readline():
		flights.append(line)

with open("./customer.sql", "r") as f:
	while line := f.readline():
		customers.append(line)

with open("./ticket_partial.sql", "r") as f:
	while line := f.readline():
		tickets.append(line)

with open("./rate_partial.sql", "r") as f:
	while line := f.readline():
		rates.append(line)

with open("./airplane.sql", "r") as f:
	while line := f.readline():
		airplanes.append(line)

with open("./flight_unfixed.sql", "r") as f:
	while line := f.readline():
		flights_unfixed.append(line)

with open("./phone_number_pool.sql", "r") as f:
	while line := f.readline():
		phone_numbers.append(line)

def split_string(s: str):
	return re.compile(r",(?=(?:[^\"']*[\"'][^\"']*[\"'])*[^\"']*$)").split(s)

def parse(sql :str) -> map:
	result = re.findall('\([^\(\)]*\)', sql)
	name_fields = result[0][1:-1].split(',')
	value_fields = split_string(result[1][1:-1])
	#value_fields = result[1][1:-1].split(',')

	field_map = {}
	
	for i in range(len(name_fields)):
		field_map[name_fields[i].strip()] = value_fields[i].strip()
	
	return field_map

def retrieve(fields :list[str], sql: str) -> list[str]:
	result = []
	parsed_sql = parse(sql)

	for field in fields:
		result.append(parsed_sql[field])

	return result

def retrieve_random(sqls :list[str], fields :list[str]) -> list[str]:
	return retrieve(fields, random.choice(sqls))

def generate_sql(mapping: map, name: str) -> str:
	fields = "("
	values = "("

	for key, value in mapping.items():
		if(isinstance(value, int)):
			value = str(value)

		fields += key + ', '
		values += value + ', '
	
	fields = fields[:-2] + ")"
	values = values[:-2] + ")"

	return f"insert into {name} {fields} values {values};"

def generate_tickets(count: int, path: str):
	def generate_ticket_sql():
		fields = {}

		[
			fields['airline_name'], fields['flight_number'], fields['departure_date_time'], base_price
		] = retrieve_random(flights, ["airline_name", "flight_number", "departure_date_time", "base_price"])
		
		[
			fields["first_name"], fields["last_name"], fields["date_of_birth"], fields["email"]
		] = retrieve_random(customers, ["first_name", "last_name", "date_of_birth", "email"])

		if(random.random() < 0.2):
			fields['calculated_price'] = "{:.2f}".format(float(base_price) * 1.25)
		else:
			fields['calculated_price'] = base_price
		
		fields['card_name'] = fields['first_name'] + " " + fields['last_name']

		[
			fields["card_type"], fields["card_number"], fields["expiration_date"], fields['purchased_date_time']
		] = retrieve_random(tickets, ["card_type", "card_number", "expiration_date", "purchased_date_time"])

		return generate_sql(fields, "ticket")
	
	with open(path, 'w') as f:
		for _ in range(count):
			f.write(generate_ticket_sql() + "\n")

def generate_ratings(count: int, path: str):
	def generate_rating_sql():
		fields = {}

		[fields["email"]] = retrieve_random(customers, ["email"])

		[
			fields['airline_name'], fields['flight_number'], fields['departure_date_time']
		] = retrieve_random(flights, ["airline_name", "flight_number", "departure_date_time"])

		[
			fields['rating'], fields['comment']
		] = retrieve_random(rates, ["rating", "comment"])

		return generate_sql(fields, "rate")

	with open(path, 'w') as f:
		for _ in range(count):
			f.write(generate_rating_sql() + "\n")

def regenerate_flight_airplane_id(path: str):
	def get_airline_max_id():
		airlines = {}
		for airplane in airplanes:
			[airline] = retrieve(["airline_name"], airplane)
			if airline not in airlines:
				airlines[airline] = 1
			else:
				airlines[airline] += 1
		
		return airlines
	
	airlines = get_airline_max_id()

	with open(path, "w") as f:
		for flight in flights_unfixed:
			fields = parse(flight)
			fields['airplane_ID'] = random.randint(0, airlines[fields['airline_name']] - 1)
			f.write(generate_sql(fields, "flight") + "\n")

def generate_customer_phone_number(path: str):
	index = 0

	with open(path, 'w') as f:
		for customer in customers:
			fields = {}

			[fields['email']] = retrieve(["email"] , customer)

			rand = random.random()

			if(rand < 0.6):
				phone_number_count = 1
			elif(rand < 0.9):
				phone_number_count = 2
			else:
				phone_number_count = 3
		
			for i in range(index, index + phone_number_count):
				[fields['phone_number']] = retrieve(["phone_number"], phone_numbers[i])
				f.write(generate_sql(fields, "customer_phone_number") + "\n")
			
			index += phone_number_count
	

def main():
	if(len(sys.argv) < 2):
		print("no task specified")
		exit()
	
	if(sys.argv[1] == 'ticket' or sys.argv[1] == 'all'):
		generate_tickets(200, "ticket.sql")

	if(sys.argv[1] == 'rate' or sys.argv[1] == 'all'):
		generate_ratings(100, "rate.sql")

	if(sys.argv[1] == 'flight' or sys.argv[1] == 'all'):
		regenerate_flight_airplane_id("flight.sql")
	
	if(sys.argv[1] == 'phone' or sys.argv[1] == 'all'):
		generate_customer_phone_number("customer_phone_number.sql")

if __name__ == '__main__':
	main()