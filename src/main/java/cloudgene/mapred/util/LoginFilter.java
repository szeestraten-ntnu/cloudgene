package cloudgene.mapred.util;

import org.restlet.Request;
import org.restlet.Response;
import org.restlet.routing.Filter;

import cloudgene.mapred.WebApp;
import cloudgene.mapred.core.User;
import cloudgene.mapred.core.JWTUtil;

public class LoginFilter extends Filter {

	private String loginPage;

	private String[] protectedRequests;

	private String prefix = "";

	public LoginFilter(String loginPage, String prefix,
			String[] protectedRequests) {
		this.loginPage = loginPage;
		this.protectedRequests = protectedRequests;
		this.prefix = prefix;
	}

	@Override
	protected int beforeHandle(Request request, Response response) {

		String path = request.getResourceRef().getPath();

		if (path.toLowerCase().equals(prefix + loginPage)) {
			String user = JWTUtil.getUserByRequest(request);
			if (user != null) {
				response.redirectTemporary(prefix + "/start.html");
				return STOP;
			}

		}

		if (isProtected(path)) {

			String user = JWTUtil.getUserByRequest(request);
			if (user == null) {
				response.redirectTemporary(prefix + loginPage);
				return STOP;
			}

		}

		return CONTINUE;
	}

	private boolean isProtected(String path) {
		for (String protectedRequest : protectedRequests) {
			if (path.toLowerCase().equals(protectedRequest)) {
				return true;
			}
		}
		return false;
	}
}
