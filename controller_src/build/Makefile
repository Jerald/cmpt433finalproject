objs := $(wildcard *.o)

all: controller

controller:
	$(CC) $(flags) $(objs) $(libpq) -o $(outPath)/$(controllerOutName)	
	mkdir -p $(HOME)/cmpt433/public/myApps/cmpt433Proj
	cp $(outPath)/$(controllerOutName) $(HOME)/cmpt433/public/myApps/cmpt433Proj/

clean:
	rm -f $(objs)
