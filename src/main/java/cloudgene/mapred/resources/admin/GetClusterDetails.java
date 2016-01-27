package cloudgene.mapred.resources.admin;

import java.io.IOException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.jar.Attributes;
import java.util.jar.Manifest;

import net.sf.json.JSONObject;

import org.apache.hadoop.mapred.ClusterStatus;
import org.restlet.data.MediaType;
import org.restlet.data.Status;
import org.restlet.representation.Representation;
import org.restlet.representation.StringRepresentation;
import org.restlet.resource.Get;

import cloudgene.mapred.Main;
import cloudgene.mapred.core.User;
import cloudgene.mapred.util.BaseResource;
import cloudgene.mapred.util.HadoopUtil;

public class GetClusterDetails extends BaseResource {

	@Get
	public Representation get() {

		User user = getAuthUser();

		if (user == null) {
			setStatus(Status.CLIENT_ERROR_UNAUTHORIZED);
			return new StringRepresentation(
					"The request requires user authentication.");
		}

		if (!user.isAdmin()) {
			setStatus(Status.CLIENT_ERROR_UNAUTHORIZED);
			return new StringRepresentation(
					"The request requires administration rights.");
		}

		JSONObject object = new JSONObject();
		object.put("maintenance", getSettings().isMaintenance());
		object.put("blocked", !getWorkflowEngine().isRunning());
		object.put("version", Main.VERSION);

		URLClassLoader cl = (URLClassLoader) Main.class.getClassLoader();
		try {
			URL url = cl.findResource("META-INF/MANIFEST.MF");
			Manifest manifest = new Manifest(url.openStream());
			Attributes attr = manifest.getMainAttributes();
			String buildVesion = attr.getValue("Version");
			String buildTime = attr.getValue("Build-Time");
			String builtBy = attr.getValue("Built-By");
			object.put("built_by", builtBy);
			object.put("built_time", buildTime);

		} catch (IOException E) {
			// handle
		}

		object.put("safemode", HadoopUtil.getInstance().isInSafeMode());
		
		object.put("maintenance", getSettings().isMaintenance());
		object.put("blocked", !getWorkflowEngine().isRunning());
		object.put("threads", getSettings().getThreadsQueue());
		object.put("max_jobs", getSettings().getMaxRunningJobs());
		object.put("max_jobs_user", getSettings().getMaxRunningJobsPerUser());

		ClusterStatus cluster = HadoopUtil.getInstance().getClusterDetails();
		StringBuffer state = new StringBuffer();
		state.append("State: " + cluster.getJobTrackerStatus().toString()
				+ "\n");
		state.append("MapTask: " + cluster.getMaxMapTasks() + "\n");
		state.append("ReduceTask: " + cluster.getMaxReduceTasks() + "\n");
		state.append("Nodes\n");
		for (String tracker : cluster.getActiveTrackerNames()) {
			state.append("  " + tracker + "\n");
		}
		state.append("Blacklist:\n");
		for (String tracker : cluster.getBlacklistedTrackerNames()) {
			state.append("  " + tracker + "\n");
		}
		object.put("cluster", state.toString());

		return new StringRepresentation(object.toString(),
				MediaType.APPLICATION_JSON);

	}
}
