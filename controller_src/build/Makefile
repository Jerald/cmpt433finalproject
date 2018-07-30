objs := $(wildcard *.o)

all: controller

controller:
	$(CC) $(flags) $(objs) $(libpq) -o $(outPath)/$(controllerOutName)	

clean:
	rm -f $(objs)
	rm -f $(outPath)/$(controllerOutName)
