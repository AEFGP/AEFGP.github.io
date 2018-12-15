#!/home/ocean/anaconda3/bin/python3
#^change the line above to point to your python environment
#This function visualize a function as a bunch of arrows instead of a 2D graph. See https://www.youtube.com/watch?v=CfW845LNObM for details
#The evenly spaced points on the original number line are connected to where they will land in the transformed number line (below and parallel to the original number line.)
#Author: Ocean Wong, May 2018, University of Birmingham.
from numpy import *; from numpy import array as ary; import numpy as np; tau = 2*pi
import matplotlib.pyplot as plt; import matplotlib as mpl

#<Change-able parameters>
Range = ary([-1,1])
def f(x):
	return sin(arccos(x))
#Must keep the function on line 12, because of some hack-y function below
#</Change-able parameters>

#Get the function name
Line = open(__file__).readlines()
function = Line[11][8:-1]
functionFileName = function.replace("/", "_over_")#change the forbidden characters to something else.

#plotting
x = np.linspace(Range[0],Range[1], 100)
y = f(x)
z = np.diff( f(x) )/np.diff(x)
Color = np.transpose(
	ary([np.linspace(1,1,len(x)), #Make the color vary
	np.linspace(0,1,len(x)),
	np.linspace(0,0,len(x)),
	np.linspace(0.8,0.8,len(x))])
	)	#transposed such that I can give a list of len(Color[n])==4 when plotting.

fig = plt.figure(facecolor='black')
#fig.patch.set_facecolor('black')
ax = fig.add_subplot(111,facecolor='black')
#ax.set_faceolor

ax.set_aspect(1)	#fix aspect ratio
ax.set_xlim(Range)	#cut off the excess of the graph
#ax.set_ylim([-1.1,1.1])
ax.set_yticks([])	#vertical case shouldn't have any coordinates.
plt.tight_layout() #same as adding #fig = plt.figure(); fig.set_tight_layout(True)#These two lines needs to be added before ax declaration

option = str(input("Do you want to differentiate (diff) or integrate the function (int)? \n (enter nothing if you want neither)"))

if option == "diff":
	z = np.diff( f(x) )/np.diff(x)
	for n in range (len(z)):
		ax.plot( [y[n],z[n]], [1,0], color = Color[n])
	plt.title("differentiate "+function)
	#plt.show()
	plt.savefig("differentiate_"+functionFileName+".png")

elif option == "int":
	dx = np.diff(x)[0]
	def Y(y):
		Y = np.zeros(len(y))
		for n in range (len(y)):
			Y[n] = sum(y[0:n])*dx
		return Y
	z = Y(y)
	for n in range (len(z)):
		ax.plot( [y[n],z[n]], [1,0], color = Color[n])
	plt.title("integrate "+function)
	#plt.show()
	plt.savefig("integrate_"+functionFileName+".png")

else:
	for n in range (len(x)):
		ax.plot( [x[n],y[n]] , [1,0], color = Color[n])
		plt.title(function)
		plt.tight_layout() #same as adding #fig = plt.figure(); fig.set_tight_layout(True)#These two lines needs to be added before 
	plt.savefig(functionFileName+".png")
