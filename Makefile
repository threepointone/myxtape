# binaries in the node modules directory
NBIN = ./node_modules/.bin

# the semicolons at the end of commands below are important
# otherwise these environment variables are not picked up

# operator ?= sets only if not present
export NODE_ENV ?= development

# operator := resolves once, otherwise we would have a loop here
export PATH := $(NBIN):$(PATH)

# setup path to log directory
ifeq ($(NODE_ENV), production)
	export LOGDIR = /var/log/node/$(APP_NAME)
else
	export LOGDIR = logs
endif


setup:
	npm install;

test:
	mocha tests/*.js

