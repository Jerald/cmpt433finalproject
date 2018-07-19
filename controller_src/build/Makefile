objs := $(wildcard *.o)

all: controller

controller:
	$(CC) $(flags) $(objs) -o $(outPath)/$(controllerOutName)

clean:
	rm -f $(objs)
