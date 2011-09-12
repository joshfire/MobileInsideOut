from fabric.api import *
import os,sys,time,re,subprocess,urllib2,platform
sys.path.append("../joshfire-framework/build")
from joshfabric import *



# Dev --------------------------------------------------------------------------

def install():
    local('rm -rf node_modules')
    local('npm install')

def serve():
    local("node server.js")

def nodemon():
    local("nodemon server.js")


# Deployment -------------------------------------------------------------------


def phonegap():
    localexport()
    local("rm -rf ../phonegap/www/*")
    local("cp -R export/* ../phonegap/www/")

env.export_dir = os.path.join(os.path.dirname(__file__), "export")


def localexport():
    spec()
    optimize()
    templates()
    #compile("export-optimized/")

    compiledstamp = int(time.time())

    local("mkdir -p %s" % (env.export_dir,))
    local("rm -rf %s/*" % (env.export_dir,))

    for f in ["img", "css", "js"]:
      local("cp -RL %s %s/" % (f,env.export_dir))

    local("cp build/index.html %s/index.html" % (env.export_dir))

    for js in os.listdir("export-optimized/"):
      local("cp export-optimized/%s %s/js/%s" % (js, env.export_dir, js))

    local("rm -rf export-optimized")

def templates():
    local("node joshfire/adapters/node/bootstrap.js joshfire/adapters/node/utils/templatecompiler.cli.js templates/ "+os.path.join(os.getcwd(),"templates_compiled"))